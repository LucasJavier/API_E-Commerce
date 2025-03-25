import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Wishlist } from '@prisma/client';
import { AddProductToWishlistDto } from './dto/add-product-to-wishlist.dto';
// Import 'getUserId'

@Injectable()
export class WishlistService {
  constructor(private readonly prismaService: PrismaService) {}
  /*
  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    try{
      return await this.prismaService.wishlist.create({
        data: {
          ...createWishlistDto,
          userId: getUserId(), // From Cognito (implement this function)
          updatedAt: new Date(),
        },
      })  
    } catch (error) {
      throw new InternalServerErrorException('Error creating wishlist');
    }
  }
  */
  async findAll(): Promise<Wishlist[]> {
    try{
      const wishlists = await this.prismaService.wishlist.findMany();
      if(wishlists.length === 0){
        throw new NotFoundException('No wishlists found');
      }
      return wishlists;
    } catch(error){
      throw new InternalServerErrorException('Error finding wishlists');
    }
  }

  async findOne(id: number): Promise<Wishlist> {
    try{
      const wishlist = await this.prismaService.wishlist.findUnique({
        where: { id: id },
      });
      if(!wishlist){
        throw new NotFoundException(`Wishlist with ID ${id} not found`);
      }
      return wishlist;
    } catch(error){
      throw new InternalServerErrorException('Error finding wishlist');
    }
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    try{
      const wishlist = await this.prismaService.wishlist.findUnique({
        where: { id: id },
      });
      if(!wishlist){
        throw new NotFoundException(`Wishlist with ID ${id} not found`);
      }
      return this.prismaService.wishlist.update({
        where: { id: id },
        data: updateWishlistDto,
      });
    } catch(error){
      throw new InternalServerErrorException('Error updating wishlist');
    }
  }

  async remove(id: number): Promise<Wishlist> {
    try{
      const wishlist = await this.prismaService.wishlist.findUnique({
        where: { id: id },
      });
      if(!wishlist){
        throw new NotFoundException(`Wishlist with ID ${id} not found`);
      }
      return this.prismaService.wishlist.delete({
        where: { id: id },
      });
    } catch(error){
      throw new InternalServerErrorException('Error deleting wishlist');
    }
  }

  async addProductToWishlist(addProductToWishlistDto: AddProductToWishlistDto): Promise<Wishlist> {
    const { productId, wishlistId } = addProductToWishlistDto;

    try {
      const wishlist = await this.prismaService.wishlist.findUnique({
        where: { id: wishlistId },
        include: { products: true },
      });
      if(!wishlist) {
        throw new NotFoundException(`Wishlist with ID ${wishlistId} not found`);
      }
      const product = await this.prismaService.product.findUnique({
        where: { id: productId },
      });
      if(!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      const productExistsInWishlist = wishlist.products.some((p) => p.id === productId);
      if(productExistsInWishlist) {
        throw new BadRequestException(`Product with ID ${productId} is already in the wishlist`);
      }
      return await this.prismaService.wishlist.update({
        where: { id: wishlistId },
        data: {
          products: {
            connect: { id: productId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error adding product to wishlist: ${error.message}`);
    }
  }
}
