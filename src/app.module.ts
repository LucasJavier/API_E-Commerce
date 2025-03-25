import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoAuthController } from './cognito-auth/cognitoAuth.controller';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { ShoppingCartsModule } from './shopping-carts/shopping-carts.module';
import { AdminWebSocketGateway } from './admin-web-socket/admin-web-socket.gateway';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    //ItemsModule,
    CognitoAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [AdminWebSocketGateway],
})
export class AppModule {}
