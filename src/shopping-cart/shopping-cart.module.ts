import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ProductModule } from 'src/product/product.module';;

@Module({
  imports: [ProductModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, PrismaService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}

