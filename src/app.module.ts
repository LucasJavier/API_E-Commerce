import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { ItemModule } from './item-cart/item-cart.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoryModule } from './category/category.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from 'prisma/prisma.module';
import { UserWebSocketModule } from './webSocket/user-web-socket/user-web-socket.module';
import { AdminWebSocketModule } from './webSocket/admin-web-socket/admin-web-socket.module';
import { ProductTrackingModule } from './product-tracking/producttracking.module';
import { GuardRolesModule } from './guard-roles/guard-roles.module';

@Module({
  imports: [
    ProductModule,
    ItemModule,
    CognitoAuthModule,
    ShoppingCartModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WishlistModule,
    CategoryModule,
    EventEmitterModule.forRoot(),
    PrismaModule,
    UserWebSocketModule,
    AdminWebSocketModule,
    ProductTrackingModule,
    GuardRolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
