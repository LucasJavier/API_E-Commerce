import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateItemDto } from './dto/create-item-cart.dto';
import { UpdateItemDto } from './dto/update-item-cart.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async addItemToCart(createItemDto: CreateItemDto, userId: string) {
    const { cartId, productId, quantity } = createItemDto;

    let item = await this.prisma.item.findFirst({
      where: { cartId, productId },
    });
    let newItem;

    if (item) {
      item = await this.prisma.item.update({
        where: { id: item.id },
        data: { quantity: item.quantity + quantity },
      });
    } else{
      const newItem = await this.prisma.item.create({
        data: {
          cart: { connect: { id: cartId } },
          product: { connect: { id: productId } },
          quantity,
        },
      });
    }
    this.eventEmitter.emit('cart.add', {
      productId: createItemDto.productId,
      userId
    });
    if(item) return item;
    else return newItem;
  }

  async updateItemQuantity(updateItemDto: UpdateItemDto, cartId: number, productId: number) {
    const item = await this.prisma.item.findFirst({
      where: { cartId, productId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    return await this.prisma.item.update({
      where: { id: item.id },
      data: { quantity: updateItemDto.quantity },
    });
  }

  async removeItemFromCart(cartId: number, productId: number) {
    const item = await this.prisma.item.findFirst({
      where: { cartId, productId },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    await this.prisma.item.delete({ where: { id: item.id } });
  }
}