import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Product } from '@prisma/client';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import * as multer from 'multer';
import { extname } from 'path';

// Configuración de AWS S3
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.AWS_REGION!;

if (!accessKeyId || !secretAccessKey || !region) {
  throw new Error('AWS S3 credentials are not defined in environment variables.');
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

// Función para subir la imagen a S3
private async uploadToS3(file: Express.Multer.File): Promise<{ imageUrl: string; imageKey: string }> {
  const fileExtension = extname(file.originalname);
  const fileKey = `products/${Date.now()}${fileExtension}`;  // Nombre único para evitar conflictos

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.send(new PutObjectCommand(params));
    return { imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`, imageKey: fileKey }; // Retorna la URL y la clave de la imagen
  } catch (error) {
    throw new InternalServerErrorException(`Error uploading file to S3: ${error.message}`);
  }
}

  // Función para crear un producto con imagen
  async create(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<Product> {
    let imageUrl: string | null = null;
    let imageKey: string | null = null;

    // Si se proporciona una imagen, la subimos a S3
    if (image) {
      const result = await this.uploadToS3(image);
      imageUrl = result.imageUrl;
      imageKey = result.imageKey;  // Guardamos la clave de la imagen
    }

    try {
      return await this.prismaService.product.create({
        data: {
          ...createProductDto,
          imageUrl,  // Guardamos la URL de la imagen
          imageKey,  // Guardamos la clave de la imagen en S3
          createdAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error creating product: ${error.message}`);
    }
  }

  // Función para actualizar la imagen del producto
  async updateImageProduct(id: number, image: Express.Multer.File): Promise<Product> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    const result = await this.uploadToS3(image);
    const imageUrl = result.imageUrl;
    const imageKey = result.imageKey;

    // Eliminar la imagen antigua de S3 (opcional)
    if (product.imageKey) {
      await this.deleteImageFromS3(product.imageKey);
    }
    
    try {
      return await this.prismaService.product.update({
        where: { id },
        data: {
          imageUrl,  // Actualiza la URL de la imagen
          imageKey,  // Actualiza la clave de la imagen
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error updating product image: ${error.message}`);
    }
  }

  // Función para eliminar la imagen de S3
  private async deleteImageFromS3(imageKey: string): Promise<void> {
    if (!BUCKET_NAME) {
      throw new Error('The S3 bucket name is not defined in the environment variables');
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: imageKey,
    };

    try {
      await s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting file from S3: ${error.message}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.prismaService.product.findMany();
      if (products.length === 0) throw new NotFoundException('Products not found');
      return products;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting the products: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
      });
      if (!product) throw new NotFoundException(`Product with id ${id} not found`);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting the product: ${error.message}`);
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
      });
      if (!product) throw new NotFoundException(`Product with id ${id} not found`);
      return await this.prismaService.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error updating the product: ${error.message}`);
    }
  }

  async remove(id: number): Promise<Product> {
    try {
      // Buscar el producto a eliminar
      const product = await this.prismaService.product.findUnique({
        where: { id },
      });
  
      if (!product) throw new NotFoundException(`Product with id ${id} not found`);
  
      // Eliminar la imagen asociada de S3 si existe
      if (product.imageKey) {
        await this.deleteImageFromS3(product.imageKey);
      }
  
      // Eliminar el producto de la base de datos
      return await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting the product: ${error.message}`);
    }
  }
  

  async validateStock(items: { productId: number; quantity: number }[]) {
    for (const item of items) {
      const product = await this.prismaService.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}`);
      }
    }
  }

  async updateStock(items: { productId: number; quantity: number }[]) {
    for (const item of items) {
      await this.prismaService.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }
}

