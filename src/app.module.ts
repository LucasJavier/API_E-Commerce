import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoryModule } from './category/category.module';
import { CognitoAuthModule } from './cognito-auth/cognitoAuth.module';

@Module({
  imports: [
    PrismaModule,
    ProductModule,
    CognitoAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
    WishlistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
