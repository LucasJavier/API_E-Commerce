import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoAuthController } from './cognito-auth/cognitoAuth.controller';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { ItemModule } from './item-cart/item-cart.module';
import { OrderModule } from './order/order.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { ItemOrderModule } from './item-order/item-order.module';
import { ShoppingCartsModule } from './shopping-carts/shopping-carts.module';
import { AdminWebSocketGateway } from './admin-web-socket/admin-web-socket.gateway';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    ItemModule,
    CognitoAuthModule,
    OrderModule,
    ShoppingCartModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ItemOrderModule,
  ],
  controllers: [],
  providers: [AdminWebSocketGateway],
})
export class AppModule {}
