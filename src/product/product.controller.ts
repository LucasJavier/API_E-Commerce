import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '@prisma/client'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AcceptedRoles } from 'src/guard-roles/role.decorator';
import { RolesGuard } from 'src/guard-roles/guard-roles.guard';

@ApiTags('Products') // Group in Swagger
@Controller('product')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // Captura la imagen enviada en 'form-data' con el nombre 'image'
  @AcceptedRoles('Admin') // Only Admin users can create products
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 500, description: 'Error creating product' })
  @ApiBody({ type: CreateProductDto })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File
  ): Promise<Product> {
      return this.productService.create(createProductDto, image);
  }

  @Get()
  @AcceptedRoles('Admin', 'User') // All users can see the products
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products found' })
  @ApiResponse({ status: 404, description: 'No products found' })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @AcceptedRoles('Admin','User') // All users can see a product
  @ApiOperation({ summary: 'Obtain a product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @AcceptedRoles('Admin') // Only Admin users can update images
  @ApiOperation({ summary: 'Update an image of a product' })
  @ApiParam({ name: 'id', description: 'ID of the product to be updated', example: 1 })
  @ApiResponse({ status: 200, description: "Product's image correctly updated" })
  @ApiResponse({ status: 404, description: "Product's image not found" })
  updateImage(@Param('id', ParseIntPipe) id: number, @UploadedFile() image: Express.Multer.File): Promise<Product> {
    return this.productService.updateImageProduct(id, image);
  }

  @Delete(':id')
  @AcceptedRoles('Admin') // Only Admin users can delete products
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'ID of the product to be deleted', example: 1 })
  @ApiResponse({ status: 200, description: 'Product correctly eliminated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.remove(id);
  }
}
