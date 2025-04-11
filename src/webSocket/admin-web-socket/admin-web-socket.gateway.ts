import { 
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProductTrackingService } from 'src/product-tracking/producttracking.service';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guard-roles/guard-roles.guard';
import { AcceptedRoles } from 'src/guard-roles/role.decorator';
import { PrismaService } from 'prisma/prisma.service';

@WebSocketGateway({ 
  cors: {
    origin: '*', // Permite cualquier origen
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
  namespace: '/admin',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@AcceptedRoles('Admin')
export class AdminWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

  private clientIntervals = new Map<string, NodeJS.Timeout>(); // Nuevo mapa para intervalos

  constructor(
    private trackingService: ProductTrackingService,
    private prisma: PrismaService,
    private jwtAuthGuard: JwtAuthGuard,
    private rolesGuard: RolesGuard
  ) {}

  async handleConnection(client: Socket) {
    //console.log(`Cliente: ${client.id}`);
    //console.log('🛡️ Intento de conexión Admin');
    //console.log('Headers recibidos:', client.handshake.headers);
    //console.log('Token recibido:', client.handshake.headers.authorization);
    //console.log('Auth:', client.handshake.auth);
    try{
      /*
      Los guards (JwtAuthGuard y RolesGuard) no se ejecutan automáticamente durante el evento handleConnection, solo en los
       manejadores de mensajes (como view-product).
      */
      const context = this.createFakeContext(client);
      // Ejecutar el guardia manualmente
      const canActivate = await this.jwtAuthGuard.canActivate(context);
      if (!canActivate) {
        throw new Error('User not authenticated');
      }
      // Ejecutar RolesGuard
      const rolesContext = this.createFakeContext(client);
      const canActivateRoles = await this.rolesGuard.canActivate(rolesContext);
      if (!canActivateRoles) {
        throw new Error('Unauthorized role');
      }
      if (!client.data?.user) {
        throw new Error('User not authenticated');
      }
      const user = client.data.user;
      console.log(`Admin conectado: ${user.userId}, Rol: ${user.roles}`);
    } catch (error) {
      console.error(`Error en conexión: ${error.message}`);
      client.disconnect(true); // Desconecta al cliente si no es admin
    }
  }

    // Crear un contexto falso para el guardia
    private createFakeContext(client: Socket): ExecutionContext {
      const fakeHandler = {}; // Objeto vacío para simular un handler
      return {
        getType: () => 'ws',
        getHandler: () => fakeHandler,
        getClass: () => AdminWebSocketGateway,
        switchToWs: () => ({
          getClient: () => client,
          getData: () => null,
        }),
      } as unknown as ExecutionContext;
    }

  async handleDisconnect(client: Socket) {
    this.trackingService.cleanupAdminSession(client.id);
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('subscribe-product')
  async handleSubscribe(client: Socket, productId: number) {
    //console.log('ID de producto recibido del admin:', productId);
    if (isNaN(productId)) {
      //console.log('ID de producto inválido:', productId);
      client.emit('error', 'ID de producto inválido');
    }
    try {
      const productExists = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!productExists) {
        client.emit('error', 'Producto no encontrado');
        return;
      }
      // Limpiar intervalo existente
      if (this.clientIntervals.has(client.id)) {
        clearInterval(this.clientIntervals.get(client.id));
        this.clientIntervals.delete(client.id);
      }
      console.log(`Admin ${client.data.user.userId} suscrito al producto ${productId}`);
      this.trackingService.registerAdminSession(client.data.user.userId, client.id, productId);
      // Enviar actualizaciones cada 2 segundos
      //console.log('[DEBUG] Intervalo iniciado para admin:', client.id);
      const interval = setInterval(() => {
        console.log('[DEBUG] Enviando stats...'); // ✅
        try {
          const stats = this.trackingService.getAdminStats(client.id, productId);
          if (stats) {
            client.emit('product-stats', { productId, ...stats });
          } else {
            console.log('[WARN] No hay estadísticas disponibles');
          } 
        } catch (error) {
            console.error('[ERROR] Obteniendo stats:', error);
          }
        }, 2000); // Cada 2 segundos
      
      // Guardar referencia al intervalo
      this.clientIntervals.set(client.id, interval);
      // Limpiar interval al desconectar
      client.on('disconnect', () => {
        clearInterval(interval);
        this.clientIntervals.delete(client.id);
      });
    } catch (error) {
      console.error('[ERROR] Subscribe-product:', error);
      client.emit('error', 'Error al suscribirse');
    }
  }

}
