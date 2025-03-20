import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Product } from '@prisma/client';
// Importar S3

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  /*
  async create(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<Product> {
    let imageUrl: string | null = null; //  Inicializo la url como null
    if(image){
      imageUrl = await uploadToS3(image); // Subir la imagen a S3 y obtener la url
      // Falta hacer este metodo
    }
    try {
      return await this.prismaService.product.create({
        data: { 
          ...createProductDto,
          imageUrl: imageUrl,
          createdAt: new Date()
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error when creating the product: ${error.message}`);
    }
  }
  */

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.prismaService.product.findMany();
      if(products.length === 0) throw new NotFoundException('Products not found');
      return products;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting the products: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Product> {
    try{
      const product = await this.prismaService.product.findUnique({
        where: { id }
      });
      if(!product) throw new NotFoundException(`Product with id ${id} not found`);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting the product: ${error.message}`);
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id }
      });
      if(!product) throw new NotFoundException(`Product with id ${id} not found`);
      return await this.prismaService.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error updating the product: ${error.message}`);
    }
  }

  /*
  async updateImageProduct(id: number, image: Express.Multer.File): Promise<Product> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id }
      });
      if(!product) throw new NotFoundException(`Product with id ${id} not found`);
      const imageUrl = await uploadToS3(image);
      return await this.prismaService.product.update({
        where: { id },
        data: { 
          imageUrl, 
          updatedAt: new Date()
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error updating the product image: ${error.message }`);
    }
  }
  */    

  async remove(id: number): Promise<Product> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id }
      });
      if(!product) throw new NotFoundException(`Product with id ${id} not found`);
      return await this.prismaService.product.delete({
        where: { id }
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting the product: ${error.message}`);
    }
  }
}
