import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';
import { CheckoutDto } from './dto/checkout.dto';
import { ItemService } from '../item-cart/item-cart.service'

@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly itemService: ItemService
  ) {}

  async createCart(createCartDto: CreateCartDto) {
    return await this.prisma.cart.create({
      data: {
        userId: createCartDto.userId,
      },
    });
  }

  async getCartByUserId(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) throw new NotFoundException(`Cart not found for the user ${userId}`);

    return cart;
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

  async checkout(cartId: number) {
    // Buscar el carrito y los items asociados
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } }, // Incluye los productos para acceder al stock y precio
    });
  
    if (!cart) {
      throw new NotFoundException(`The cart with ID ${cartId} does not exist.`);
    }
  
    if (cart.items.length === 0) {
      throw new BadRequestException('The cart is empty.');
    }
  
    // Extraer items del carrito
    const items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));
  
    // Validar stock antes de proceder
    await this.productService.validateStock(items);
  
    // Actualizar stock de los productos
    await this.productService.updateStock(items);
  
    // Calcular total de la orden
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
    // Crear la orden asociada al usuario del carrito
    const order = await this.prisma.order.create({
      data: {
        cartId,
        userId: cart.userId,
        total,
        status: 'PENDING',
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
  
    // Vaciar carrito eliminando los ítems
    await this.prisma.item.deleteMany({ where: { cartId } });
  
    return { message: 'Compra finalizada con éxito', order };
  }
  
  
}