import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category, Product } from '@prisma/client';
import { RolesGuard } from 'src/guard-roles/guard-roles.guard';
import { AcceptedRoles } from 'src/guard-roles/role.decorator';
import { JwtAuthGuard } from 'src/cognito-auth/cognito-auth.guard';

@ApiTags('Categories') // Agrupa en Swagger
@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @AcceptedRoles('Admin') // Only Admin users can create categories
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 500, description: 'Error creating category' })
  @ApiBody({ type: CreateCategoryDto })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @AcceptedRoles('Admin', 'User') // Admin and User users can get all categories
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories found' })
  @ApiResponse({ status: 404, description: 'No categories found' })
  @ApiResponse({ status: 500, description: 'Error getting all the categories' })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @AcceptedRoles('Admin', 'User') // Admin and User users can get a category
  @ApiOperation({ summary: 'Obtain a category' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 500, description: 'Error getting the category' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @AcceptedRoles('Admin') // Only Admin users can update categories 
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'ID of the category to be updated', example: 1 })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category correctly updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 500, description: 'Error updating the category' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')  
  @AcceptedRoles('Admin') // Only Admin users can delete categories
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'ID of the category to be deleted', example: 1 })
  @ApiResponse({ status: 200, description: 'Category correctly eliminated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 500, description: 'Error deleting the category' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.remove(id);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get all products of a category' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 1 })
  @ApiResponse({ status: 200, description: 'List of products found for the category' })
  @ApiResponse({ status: 404, description: 'Category or products not found' })
  @ApiResponse({ status: 500, description: 'Error finding products for the category' })
  findProductsByCategoryId(@Param('id', ParseIntPipe) id: number): Promise<{category: Category, products: Product[] | null}> {
    return this.categoryService.findProductsByCategoryId(id);
  }
}