import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';
import { CheckoutDto } from './dto/checkout.dto';
import { ItemService } from '../item/item.service'

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

    if (!cart) throw new NotFoundException(`Carrito no encontrado para el usuario ${userId}`);

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
    // 1. Buscar el carrito y los items asociados
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } }, // Incluye los productos para acceder al stock y precio
    });
  
    if (!cart) {
      throw new NotFoundException(`El carrito con ID ${cartId} no existe.`);
    }
  
    if (cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío.');
    }
  
    // 2. Extraer items del carrito
    const items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));
  
    // 3. Validar stock antes de proceder
    await this.productService.validateStock(items);
  
    // 4. Actualizar stock de los productos
    await this.productService.updateStock(items);
  
    // 5. Calcular total de la orden
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
    // 6. Crear la orden asociada al usuario del carrito
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
  
    // 7. Vaciar carrito eliminando los ítems
    await this.prisma.item.deleteMany({ where: { cartId } });
  
    return { message: 'Compra finalizada con éxito', order };
  }
  
  
}



