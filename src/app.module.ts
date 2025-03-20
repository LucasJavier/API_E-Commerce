import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoAuthController } from './cognito-auth/cognitoAuth.controller';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { ShoppingCartsModule } from './shopping-carts/shopping-carts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    //ItemsModule,
    UsersModule,
    CognitoAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
