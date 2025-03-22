import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class ShoppingCartsService {
  constructor(private prisma: PrismaService) {}

  async createCart(createCartDto: CreateCartDto) {
    return await this.prisma.cart.create({
      data: {
        userId: createCartDto.userId,
      },
    });
  }

  async getCartByUserId(userId: string) {
    return await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async updateCart(cartId: number, updateCartDto: UpdateCartDto) {
    return await this.prisma.cart.update({
      where: { id: cartId },
      data: updateCartDto,
    });
  }

  async deleteCart(cartId: number) {
    return await this.prisma.cart.delete({
      where: { id: cartId },
    });
  }
  async checkout(checkoutDto: CheckoutDto) {
    const { cartId, items } = checkoutDto;

    // Verificar existencia del carrito
    const cartExists = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cartExists) throw new Error(`El carrito con ID ${cartId} no existe.`);

    // Validar y actualizar stock
    await this.productService.validateStock(items);
    await this.productService.updateStock(items);

    // Crear orden
    const order = await this.orderService.createOrder(cartId, items);

    // Vaciar carrito
    await this.prisma.item.deleteMany({ where: { cartId } });

    return { message: 'Compra finalizada con éxito', order };
  }
}


