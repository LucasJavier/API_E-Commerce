import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingCartService } from './shopping-cart.service';
import { PrismaService } from 'prisma/prisma.service';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { ItemService } from '../item-cart/item-cart.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let prisma: {
    cart: {
      create: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      findUnique: jest.Mock;
    };
    item: {
      deleteMany: jest.Mock;
    };
    order: {
      create: jest.Mock;
    };
  };
  let productService: {
    validateStock: jest.Mock;
    updateStock: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      cart: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
      item: {
        deleteMany: jest.fn(),
      },
      order: {
        create: jest.fn(),
      },
    };

    productService = {
      validateStock: jest.fn(),
      updateStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingCartService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProductService, useValue: productService },
        { provide: OrderService, useValue: {} },
        { provide: ItemService, useValue: {} },
      ],
    }).compile();

    service = module.get(ShoppingCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCartByUserId', () => {
    it('should return the user cart with items', async () => {
      const userId = 'user-123';
      const mockCart = { id: 1, userId, items: [] };
      prisma.cart.findFirst.mockResolvedValue(mockCart);

      const result = await service.getCartByUserId(userId);
      expect(result).toEqual(mockCart);
    });

    it('should throw NotFound if cart does not exist', async () => {
      prisma.cart.findFirst.mockResolvedValue(null);
      await expect(service.getCartByUserId('user-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkout', () => {
    it('should throw NotFound if cart does not exist', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      await expect(service.checkout(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequest if cart is empty', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 'user-123', items: [] });
      await expect(service.checkout(1)).rejects.toThrow(BadRequestException);
    });

    it('should process checkout and return order', async () => {
      const mockItems = [
        { productId: 1, quantity: 2, product: { price: 100 } },
        { productId: 2, quantity: 1, product: { price: 50 } },
      ];
      const mockCart = { id: 1, userId: 'user-123', items: mockItems };
      const mockOrder = { id: 1, cartId: 1, userId: 'user-123', total: 250, items: [] };

      prisma.cart.findUnique.mockResolvedValue(mockCart);
      productService.validateStock.mockResolvedValue(undefined);
      productService.updateStock.mockResolvedValue(undefined);
      prisma.order.create.mockResolvedValue(mockOrder);
      prisma.item.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.checkout(1);

      expect(productService.validateStock).toHaveBeenCalledWith([
        { productId: 1, quantity: 2, price: 100 },
        { productId: 2, quantity: 1, price: 50 },
      ]);
      expect(productService.updateStock).toHaveBeenCalled();
      expect(prisma.order.create).toHaveBeenCalled();
      expect(prisma.item.deleteMany).toHaveBeenCalledWith({ where: { cartId: 1 } });
      expect(result).toEqual({ message: 'Compra finalizada con éxito', order: mockOrder });
    });
  });
});







