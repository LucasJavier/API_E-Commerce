import { Injectable, NotFoundException, OnModuleDestroy, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from 'prisma/prisma.service';
import { Server } from 'socket.io'
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';


@Injectable()
@UseGuards(JwtAuthGuard)
export class ProductTrackingService implements OnModuleDestroy {

    private readonly productViewers = new Map<number, Set<string>>();
    private readonly activeAdmins = new Map<string, {
        adminId: string; // ID del usuario admin
        products: Map<number, {
            wishlist: {
                count: number;
                users: Set<string>;
            }
            cart: {
                count: number;
                users: Set<string>;
            }
            startTime: Date;
        }>;
    }>();

    // Mapa de intervalos para limpiar sesiones de admins
    private readonly intervals = new Map<string, NodeJS.Timeout>(); // NodeJS.Timeout es el tipo de los intervalos

    constructor(
        private eventEmitter: EventEmitter2,
        private readonly prismaService: PrismaService
    ) {
        this.setupEventListeners();
    }

    private setupEventListeners() {

        this.eventEmitter.on('wishlist.add', (data: { productId: number, userId: string }) => {
            console.log(`📢 Evento wishlist.add recibido para producto ${data.productId}`);
            // Recorre todos los admins activos, con los productos que esta viendo
            this.activeAdmins.forEach((adminData) => { 
                // Para cada admin, recorre los productos que está monitoreando
                // Stats es un objeto con los contadores de wishlist, carrito y vistas
                adminData.products.forEach((stats, productId) => {
                    // Si el producto del evento coincide con uno monitoreado
                    if (productId === data.productId) {
                        // Verificar si el usuario ya fue contado
                        if (!stats.wishlist.users.has(data.userId)) {
                            stats.wishlist.count++;
                            stats.wishlist.users.add(data.userId); // Registrar usuario
                        }
                    }
                });
            });
        });

        // Misma logica que el evento anterior, pero para el carrito
        this.eventEmitter.on('cart.add', (data: { productId: number; userId: string }) => {
            console.log(`📢 Evento cart.add recibido para producto ${data.productId}`);
            this.activeAdmins.forEach((adminData) => {
                adminData.products.forEach((stats, productId) => {
                    if (productId === data.productId) {
                        if (!stats.cart.users.has(data.userId)) {
                            stats.cart.count++;
                            stats.cart.users.add(data.userId); // Registrar usuario
                        }
                    }
                });
            });
        });
        
    }

    // Métodos para seguir las vistas
    addViewer(productId: number, userId: string, server: Server) {
        console.log(`Usuario ${userId} está viendo el producto ${productId}!!!`);
        if (!this.productViewers.has(productId)) {
            this.productViewers.set(productId, new Set());
        }
        this.productViewers.get(productId)!.add(userId);
        this.notifyAdminViewersChange(server, productId);
    }

    removeViewer(productId: number, userId: string, server: Server) {
        if (this.productViewers.has(productId)) {
            const deleted = this.productViewers.get(productId)!.delete(userId);
            if (deleted) {
                this.notifyAdminViewersChange(server, productId);
            }
        }
    }

    // Devuelve la cantidad de usuarios que están viendo un producto
    getViewersCount(productId: number): number {
        return this.productViewers.get(productId)?.size || 0;
    }

    // Métodos para registrar los admins
    async registerAdminSession(adminId: string, clientId: string, productId: number) {
        console.log(`Buscando admin en DB con ID: ${adminId}`);
        const adminExists = await this.prismaService.user.findUnique({
            where: { id: adminId }
        });

        if (!adminExists) {
            console.error('Admin no encontrado en la DB');
            throw new NotFoundException('Admin not found');
        }

        console.log('[DEBUG] Admin encontrado:', adminExists);

        if (!this.activeAdmins.has(clientId)) {
          this.activeAdmins.set(clientId, {
            adminId,
            products: new Map()
          });
        }
        
        const adminData = this.activeAdmins.get(clientId)!;
        if(adminData){
            adminData.products.set(productId, {
                wishlist: {
                    count: 0,
                    users: new Set()
                },
                cart: {
                    count: 0,
                    users: new Set()
                },
                startTime: new Date()
            });
        }
    
        // Limpiar sesiones cada hora
        this.intervals.set(clientId, setTimeout(() => {
          this.activeAdmins.delete(clientId);
          this.intervals.delete(clientId);
        }, 3600000)); // 1 hora
    }

    // Devuelve los stats al admin
    getAdminStats(clientId: string, productId: number) {
        const adminData = this.activeAdmins.get(clientId);
        if (!adminData) return null;
        const productStats = adminData.products.get(productId);
        if (!productStats) return null;
        return {
          viewers: this.getViewersCount(productId),
          wishlistCount: productStats.wishlist.count,
          cartCount: productStats.cart.count
        };
    }

    // Limpia la sesión del admin al desconectarse
    cleanupAdminSession(clientId: string) {
        if (this.activeAdmins.has(clientId)) {
            this.activeAdmins.delete(clientId);
        }
        const interval = this.intervals.get(clientId);
        if(interval) {
            clearTimeout(interval);
            this.intervals.delete(clientId); // Limpia intervalo
        }
    }

    // Limpia al usuario de todos los productos que está viendo
    private removeViewerFromAllProducts(userId: string, server: Server): void {
        this.productViewers.forEach((viewersSet, productId) => {
            if (viewersSet.has(userId)) {
                viewersSet.delete(userId);
                this.notifyAdminViewersChange(server, productId);
                // Eliminar entrada si queda vacía
                if (viewersSet.size === 0) {
                    this.productViewers.delete(productId);
                }
            }
        });
    }

    // Notifica a los admins sobre cambios en los productos que están viendo
    private notifyAdminViewersChange(server: Server, productId: number) {
        this.activeAdmins.forEach((adminData, clientId) => {
            if (adminData.products.has(productId)) {
                const stats = this.getAdminStats(clientId, productId);
                server.to(clientId).emit('product-update', {
                    productId,
                    ...stats
                });
            }
        });
    }

    // Maneja la desconexión de un usuario
    public handleUserDisconnect(userId: string, server: Server): void {
        this.removeViewerFromAllProducts(userId, server);
        // Notificar cambios para todos los productos afectados
        this.productViewers.forEach((_, productId) => { // Solo necesitamos la clave
          this.notifyAdminViewersChange(server, productId);
        });
    }

    // Maneja la desconexión de los admin
    onModuleDestroy() {
        this.eventEmitter.removeAllListeners();
    }
}
