import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from './product/product.module';
//import { ItemsModule } from './items/items.module';
//import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';
import { ShoppingCartsModule } from './shopping-carts/shopping-carts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    //ItemsModule,
    UsersModule,
    //AuthModule,
    CognitoAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ShoppingCartsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
