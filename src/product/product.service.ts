import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<Product> {
    let imageUrl: string | null = null; //  Inicializo la url como null
    if(image){
      imageUrl = uploadToS3(image); // Subo la imagen a S3 y obtengo la url
    }
    try {
      return this.prismaService.product.create({
        data: { 
          ...createProductDto,
          imageUrl: imageUrl
        }
      });
    } catch (error) {
      throw new Error(`Error when creating the product: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
