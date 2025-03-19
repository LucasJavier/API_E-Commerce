import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
