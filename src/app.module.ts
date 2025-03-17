import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, CategoryModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
