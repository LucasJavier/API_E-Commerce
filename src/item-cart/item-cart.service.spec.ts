import { ItemService } from './item-cart.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateItemDto } from '../item-cart/dto/create-item-cart.dto';
import { UpdateItemDto } from '../item-cart/dto/update-item-cart.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ItemService', () => {
  let service: ItemService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    prisma = {
      item: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    eventEmitter = {
      emit: jest.fn(),
    } as any;

    service = new ItemService(prisma, eventEmitter);
  });

  describe('addItemToCart', () => {
    it('actualiza la cantidad si el item ya existe', async () => {
      const existingItem = { id: 1, quantity: 2 };
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(existingItem);
      (prisma.item.update as jest.Mock).mockResolvedValue({
        ...existingItem,
        quantity: 5,
      });

      const dto: CreateItemDto = { cartId: 1, productId: 1, quantity: 3 };
      const result = await service.addItemToCart(dto, 'user-123');

      expect(prisma.item.findFirst).toHaveBeenCalledWith({
        where: { cartId: 1, productId: 1 },
      });
      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 5 },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('cart.add', {
        productId: dto.productId,
        userId: 'user-123',
      });
      expect(result.quantity).toBe(5);
    });

    it('crea un nuevo item si no existe', async () => {
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(null);
      const createdItem = { id: 2, cartId: 1, productId: 1, quantity: 3 };
      (prisma.item.create as jest.Mock).mockResolvedValue(createdItem);

      const dto: CreateItemDto = { cartId: 1, productId: 1, quantity: 3 };
      const result = await service.addItemToCart(dto, 'user-123');

      expect(prisma.item.create).toHaveBeenCalledWith({
        data: {
          cart: { connect: { id: 1 } },
          product: { connect: { id: 1 } },
          quantity: 3,
        },
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('cart.add', {
        productId: dto.productId,
        userId: 'user-123',
      });
      expect(result).toEqual(createdItem);
    });
  });

  describe('updateItemQuantity', () => {
    it('actualiza la cantidad del item si existe', async () => {
      const item = { id: 1 };
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(item);
      const updated = { ...item, quantity: 10 };
      (prisma.item.update as jest.Mock).mockResolvedValue(updated);

      const dto: UpdateItemDto = { cartId: 1, productId: 1, quantity: 10 };
      const result = await service.updateItemQuantity(dto, dto.cartId, dto.productId);

      expect(prisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 10 },
      });
      expect(result).toEqual(updated);
    });

    it('lanza error si el item no existe', async () => {
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(null);
      const dto: UpdateItemDto = { cartId: 1, productId: 1, quantity: 10 };

      await expect(service.updateItemQuantity(dto, dto.cartId, dto.productId)).rejects.toThrow('Item not found');
    });
  });

  describe('removeItemFromCart', () => {
    it('elimina el item si existe', async () => {
      const item = { id: 1 };
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(item);
      (prisma.item.delete as jest.Mock).mockResolvedValue(undefined);

      await service.removeItemFromCart(1, 1);

      expect(prisma.item.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('lanza error si el item no existe', async () => {
      (prisma.item.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.removeItemFromCart(1, 1)).rejects.toThrow('Item not found');
    });
  });
});


