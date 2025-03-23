import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto } from '../order/dto/create-oder.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { cartId, userId, items } = createOrderDto;

    // Calcular el total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      return await this.prisma.order.create({
        data: {
          cartId,
          userId,
          total,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating order.');
    }
  }

  async getOrderById(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new NotFoundException(`Order with ID ${orderId} 
not found`);

    return order;
  }
}
