import { Module } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ProductController } from '../product/product.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  exports: [ProductService],
})
export class ProductsModule {}