import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from 'prisma/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      wishlist: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(WishlistService);
  });

  describe('findAll', () => {
    it('should return wishlists if found', async () => {
      const mockWishlists = [{ id: 1 }, { id: 2 }];
      prisma.wishlist.findMany.mockResolvedValue(mockWishlists);

      const result = await service.findAll();
      expect(result).toEqual(mockWishlists);
    });

    it('should throw NotFoundException if no wishlists found', async () => {
      prisma.wishlist.findMany.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if something goes wrong', async () => {
      prisma.wishlist.findMany.mockRejectedValue(new Error());
      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a wishlist if found', async () => {
      const mockWishlist = { id: 1 };
      prisma.wishlist.findUnique.mockResolvedValue(mockWishlist);

      const result = await service.findOne(1);
      expect(result).toEqual(mockWishlist);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if something goes wrong', async () => {
      prisma.wishlist.findUnique.mockRejectedValue(new Error());
      await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update and return wishlist if found', async () => {
      const mockWishlist = { id: 1 };
      const updateDto = { name: 'Updated Wishlist' };
      prisma.wishlist.findUnique.mockResolvedValue(mockWishlist);
      prisma.wishlist.update.mockResolvedValue({ ...mockWishlist, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result).toEqual({ id: 1, name: 'Updated Wishlist' });
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue(null);
      await expect(service.update(1, { name: 'test' })).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if something goes wrong', async () => {
      prisma.wishlist.findUnique.mockRejectedValue(new Error());
      await expect(service.update(1, { name: 'test' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete and return wishlist if found', async () => {
      const mockWishlist = { id: 1 };
      prisma.wishlist.findUnique.mockResolvedValue(mockWishlist);
      prisma.wishlist.delete.mockResolvedValue(mockWishlist);

      const result = await service.remove(1);
      expect(result).toEqual(mockWishlist);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if something goes wrong', async () => {
      prisma.wishlist.findUnique.mockRejectedValue(new Error());
      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('addProductToWishlist', () => {
    it('should add product to wishlist and return updated wishlist', async () => {
      const dto = { productId: 2, wishlistId: 1 };
      const mockWishlist = {
        id: 1,
        products: [{ id: 3 }],
      };
      const mockProduct = { id: 2 };
      const updatedWishlist = { id: 1, products: [{ id: 3 }, { id: 2 }] };
  
      prisma.wishlist.findUnique.mockResolvedValueOnce(mockWishlist);
      prisma.product.findUnique.mockResolvedValueOnce(mockProduct);
      prisma.wishlist.update.mockResolvedValueOnce(updatedWishlist);
  
      const result = await service.addProductToWishlist(dto);
      expect(result).toEqual(updatedWishlist);
    });
  
    it('should throw NotFoundException if wishlist not found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue(null);
      await expect(
        service.addProductToWishlist({ productId: 1, wishlistId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should throw NotFoundException if product not found', async () => {
      prisma.wishlist.findUnique.mockResolvedValue({ id: 1, products: [] });
      prisma.product.findUnique.mockResolvedValue(null);
  
      await expect(
        service.addProductToWishlist({ productId: 1, wishlistId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  
    it('should throw BadRequestException if product is already in wishlist', async () => {
      prisma.wishlist.findUnique.mockResolvedValue({
        id: 1,
        products: [{ id: 2 }],
      });
  
      prisma.product.findUnique.mockResolvedValue({ id: 2 });
  
      await expect(
        service.addProductToWishlist({ productId: 2, wishlistId: 1 }),
      ).rejects.toThrow(BadRequestException);
    });
  
    it('should throw InternalServerErrorException on unknown error', async () => {
      prisma.wishlist.findUnique.mockRejectedValue(new Error('Something went wrong'));
  
      await expect(
        service.addProductToWishlist({ productId: 1, wishlistId: 1 }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});


