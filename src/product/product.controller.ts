import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '@prisma/client'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { validateImage } from '../util/image.validation';
import { RolesGuard } from 'src/guard-roles/guard-roles.guard';
import { AcceptedRoles } from 'src/guard-roles/role.decorator';

@ApiTags('Products')
@Controller('product')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /*
  @Post()
  @AcceptedRoles('Admin') // Only Admin users can create products
  @UseInterceptors(FileInterceptor('image')) // Captura la imagen enviada en 'form-data' con el nombre 'image'
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 500, description: 'Error creating product' })
  @ApiBody({ type: CreateProductDto })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<Product> {
    if (image && !validateImage(image)) {
      throw new BadRequestException('File is not an image');
    }
    return this.productService.create(createProductDto, image);
  }
  
  @Get()
  @AcceptedRoles('Admin', 'User') // Admin and User users can get all products 
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products found' })
  @ApiResponse({ status: 404, description: 'No products found' })
  @ApiResponse({ status: 500, description: 'Error getting all the products' })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @AcceptedRoles('Admin', 'User') // Admin and User users can get a product
  @ApiOperation({ summary: 'Obtain a product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Error getting the product' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @AcceptedRoles('Admin') // Only Admin users can update products
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'ID of the product to be updated', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product correctly updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Error updating the product' })
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Patch(':id/image')
  @AcceptedRoles('Admin') // Only Admin users can update images
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update an image of a product' })
  @ApiParam({ name: 'id', description: 'ID of the product to be updated', example: 1 })
  @ApiResponse({ status: 200, description: "Product's image correctly updated" })
  @ApiResponse({ status: 404, description: "Product's image not found" })
  @ApiResponse({ status: 500, description: "Error updating the product's image" })
  updateImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() image: Express.Multer.File): Promise<Product> {
    if (image && !validateImage(image)) {
      throw new BadRequestException('File is not an image');
    }
    return this.productService.updateImageProduct(id, image);
  }

  @Delete(':id')
  @AcceptedRoles('Admin') // Only Admin users can delete products
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'ID of the product to be deleted', example: 1 })
  @ApiResponse({ status: 200, description: 'Product correctly eliminated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 500, description: 'Error deleting the product' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.remove(id);
  }
    */
}
