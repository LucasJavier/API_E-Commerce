import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShoppingCartsService } from './shopping-carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Shopping Cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo carrito' })
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
}

