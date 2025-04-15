import { Module } from '@nestjs/common';
import { ItemService } from './item-cart.service';
import { ItemController } from './item-cart.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  providers: [ItemService, PrismaService, ShoppingCartService],
  controllers: [ItemController],
  exports: [ItemService],
})
export class ItemModule {}