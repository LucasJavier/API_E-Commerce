import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';
import { ExecutionContext, ForbiddenException, UseGuards } from '@nestjs/common';
import { ProductTrackingService } from 'src/product-tracking/producttracking.service';
import { RolesGuard } from 'src/guard-roles/guard-roles.guard';
import { AcceptedRoles } from 'src/guard-roles/role.decorator';
 
@WebSocketGateway({
  cors: {
    origin: '*', // Permite cualquier origen (solo para desarrollo)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
  namespace: '/user'
})
@UseGuards(JwtAuthGuard, RolesGuard)
@AcceptedRoles('User')
export class UserWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    private trackingService: ProductTrackingService,
    private jwtAuthGuard: JwtAuthGuard, // Inyectar el guardia
    private rolesGuard: RolesGuard // Inyectar el guardia de roles
  ) {}

  async handleConnection(client: Socket) {
    try{
      // Ejecutar JwtAuthGuard
      const authContext = this.createFakeContext(client);
      const canActivateAuth = await this.jwtAuthGuard.canActivate(authContext);
      if (!canActivateAuth) {
        throw new Error('User not authenticated');
      }

      // Ejecutar RolesGuard
      const rolesContext = this.createFakeContext(client);
      const canActivateRoles = await this.rolesGuard.canActivate(rolesContext);
      if (!canActivateRoles) {
        throw new Error('Unauthorized role');
      }
      console.log(`✅ Usuario autenticado: ${client.data.user.userId}`);
    } catch (error) {
      let errorMessage = error.message;
      if (error instanceof ForbiddenException) {
        errorMessage = error.getResponse()['message'] || errorMessage;
      }
      console.error(`❌ Error en conexión: ${errorMessage}`);
      console.error('Detalles del error:', error); 
      client.disconnect(true);
    }
  }

  private createFakeContext(client: Socket): ExecutionContext {
    const fakeHandler = {}; // Objeto vacío para simular un handler
    return {
      getType: () => 'ws',
      getHandler: () => fakeHandler,
      getClass: () => UserWebSocketGateway,
      switchToWs: () => ({
        getClient: () => client,
        getData: () => null,
      }),
    } as unknown as ExecutionContext;
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.userId;
    if (userId) {
      this.trackingService.handleUserDisconnect(userId, this.server);
    }
    console.log(`Usuario desconectado: ${client.id}`);
  }

  @SubscribeMessage('view-product')
  handleViewProduct(client: Socket, productId: number) {
    //console.log(`Usuario ${client.data.user.userId} está viendo el producto ${productId}`);
    const userId = client.data.user.userId;
    this.trackingService.addViewer(productId, userId, this.server);
  }

  @SubscribeMessage('leave-product')
  handleLeaveProduct(client: Socket, productId: number) {
    const userId = client.data.user.userId;
    this.trackingService.removeViewer(productId, userId, this.server);
  }
}
