import { Module } from '@nestjs/common';
import { ShoppingCartsService } from './shopping-carts.service';
import { ShoppingCartController } from './shopping-carts.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ShoppingCartController],
  providers: [ShoppingCartsService, PrismaService],
  exports: [ShoppingCartsService],
})
export class ShoppingCartModule {}

