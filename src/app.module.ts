import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { ItemsModule } from './items/items.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
<<<<<<< HEAD
import { ProductModule } from './product/product.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, CategoryModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
=======
import { CognitoAuthController } from './cognito-auth/cognitoAuth.controller';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';

@Module({
  imports: [
    PrismaModule,
    //ProductsModule,
    //ItemsModule,
    //UserModule,
    //AuthModule,
    CognitoAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
>>>>>>> SCRUM-4-6_Cognito-Roles_Usuarios
})
export class AppModule {}
