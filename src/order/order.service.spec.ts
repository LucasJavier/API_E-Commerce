import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const dto = {
        cartId: 1,
        userId: '2', // Cambiado a string
        items: [
          { productId: 1, quantity: 2, price: 100 },
          { productId: 2, quantity: 1, price: 50 },
        ],
      };

      const createdOrder = {
        id: 1,
        cartId: 1,
        userId: '2', // También como string
        total: 250,
        items: [
          { productId: 1, quantity: 2, price: 100 },
          { productId: 2, quantity: 1, price: 50 },
        ],
      };

      prisma.order.create.mockResolvedValue(createdOrder);

      const result = await service.createOrder(dto);
      expect(result).toEqual(createdOrder);
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          cartId: dto.cartId,
          userId: dto.userId,
          total: 250,
          items: {
            create: dto.items,
          },
        },
        include: { items: true },
      });
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      prisma.order.create.mockRejectedValue(new Error('DB error'));

      await expect(
        service.createOrder({
          cartId: 1,
          userId: '1', // string
          items: [{ productId: 1, quantity: 1, price: 100 }],
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getOrderById', () => {
    it('should return an order if found', async () => {
      const order = {
        id: 1,
        cartId: 1,
        userId: '1', // string
        total: 100,
        items: [],
      };

      prisma.order.findUnique.mockResolvedValue(order);

      const result = await service.getOrderById(1);
      expect(result).toEqual(order);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { items: true },
      });
    });

    it('should throw NotFoundException if order is not found', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.getOrderById(1)).rejects.toThrow(NotFoundException);
    });
  });
});

