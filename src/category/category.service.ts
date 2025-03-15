import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void>{
    try{
      await this.prismaService.category.create({
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
      return await this.prismaService.category.update({
        where: { id: id },
        data: updateCategoryDto,
      });
    } catch(error){
      throw new InternalServerErrorException(`Error updating category: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try{
      await this.prismaService.category.delete({
        where: { id: id },
      });
    } catch(error){
      throw new InternalServerErrorException(`Error deleting category: ${error.message}`);
    }
  }
}