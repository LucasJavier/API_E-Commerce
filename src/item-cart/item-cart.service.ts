import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateItemDto } from '../item-cart/dto/create-item-cart';
import { UpdateItemDto } from '../item-cart/dto/update-item-cart';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async addItemToCart(createItemDto: CreateItemDto) {
    const { cartId, productId, quantity } = createItemDto;

    let item = await this.prisma.item.findFirst({
      where: { cartId, productId },
    });

    if (item) {
      item = await this.prisma.item.update({
        where: { id: item.id },
        data: { quantity: item.quantity + quantity },
      });
      return item;
    }

    return await this.prisma.item.create({
      data: {
        cart: { connect: { id: cartId } },
        product: { connect: { id: productId } },
        quantity,
      },
    });
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


