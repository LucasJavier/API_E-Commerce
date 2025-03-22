import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaService } from 'prisma/prisma.service'; // Prisma service
import { ShoppingCartsService } from '../carts/shopping-carts.service';  // Carrito de compras

@Module({
  imports: [],
  providers: [ItemService, PrismaService, ShoppingCartsService],
  controllers: [ItemController],
  exports: [ItemService],  // Exportamos el servicio para que pueda ser inyectado en otros módulos
})
export class ItemModule {}