import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoryModule } from './category/category.module';
import { CognitoAuthController } from './cognito-auth/cognitoAuth.controller';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    CognitoAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
    WishlistModule,
  ],
  controllers: [],
  providers: [],
=======
import { ProductModule } from './product/product.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, CategoryModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
