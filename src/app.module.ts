import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoAuthController } from './cognito-auth/cognitoAuth.controller';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { ItemModule } from './item/item.module';
import { OrderModule } from './order/order.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
