import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Category, Product } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category>{
    try{
      return await this.prismaService.category.create({
        data: createCategoryDto,
      });
    } catch(error){
      throw new InternalServerErrorException(`Error creating category: ${error.message}`);
    }
  }

  async findAll(): Promise<Category[]> {
    try{
      const categories = await this.prismaService.category.findMany();
      if(categories.length === 0){
        throw new NotFoundException('No categories found');
      }
      return categories;
    } catch(error){
      throw new InternalServerErrorException(`Error finding categories: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Category> {
    try{
      const category = await this.prismaService.category.findUnique({
        where: { id: id },
      });
      if(!category){
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch(error){
      throw new InternalServerErrorException(`Error finding category: ${error.message}`);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try{
      const category = await this.prismaService.category.findUnique({
        where: { id: id },
      });
      if(!category){
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return await this.prismaService.category.update({
        where: { id: id },
        data: updateCategoryDto,
      });
    } catch(error){
      throw new InternalServerErrorException(`Error updating category: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Category> {
    try{
      const category = await this.prismaService.category.findUnique({
        where: { id: id },
      });
      if(!category){
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return await this.prismaService.category.delete({
        where: { id: id },
      });
    } catch(error){
      throw new InternalServerErrorException(`Error deleting category: ${error.message}`);
    }
  }
  
  async findProductsByCategoryId(categoryId: number): Promise<{category: Category, products: Product[] | null}> {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      const products = await this.prismaService.product.findMany({
        where: { categoryId: categoryId },
      });
      if (products.length === 0) {
        throw new NotFoundException(`No products found for category with ID ${categoryId}`);
      }
      return {category, products };
    } catch (error) {
      throw new InternalServerErrorException(`Error finding products for category: ${error.message}`);
    }
  }
}