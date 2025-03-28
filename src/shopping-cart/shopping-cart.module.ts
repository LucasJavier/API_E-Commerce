import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { ItemService } from 'src/item/item.service';

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, PrismaService, ItemService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}

