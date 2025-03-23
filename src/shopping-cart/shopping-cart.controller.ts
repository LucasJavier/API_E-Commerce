import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CheckoutDto } from './dto/checkout.dto'; // Importar el DTO

@ApiTags('Shopping Cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Crear un nuevo carrito' })
  @ApiResponse({ status: 201, description: 'Carrito creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createCartDto: CreateCartDto) {
    return this.shoppingCartService.createCart(createCartDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener el carrito de un usuario' })
  async findByUser(@Param('userId') userId: string) {
    return this.shoppingCartService.getCartByUserId(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar el carrito' })
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    return this.shoppingCartService.updateCart(Number(id), updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar el carrito' })
  async remove(@Param('id') id: number) {
    return this.shoppingCartService.deleteCart(Number(id));
  }


  @Post(':cartId/checkout')
  @ApiOperation({ summary: 'Realizar el checkout de un carrito' })
  async checkout(@Param('cartId') cartId: number) {
    return this.shoppingCartService.checkout(Number(cartId));
  }

}


