import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaService } from 'prisma/prisma.service'; // Prisma service
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';  // Carrito de compras
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [ProductModule, OrderModule],
  providers: [ItemService, PrismaService, ShoppingCartService],
  controllers: [ItemController],
  exports: [ItemService],
})
export class ItemModule {}