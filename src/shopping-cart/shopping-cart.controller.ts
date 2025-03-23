import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Shopping Cart')
@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createCartDto: CreateCartDto) {
    return this.shoppingCartService.createCart(createCartDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByUser(@Param('userId') userId: string) {
    return this.shoppingCartService.getCartByUserId(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cart' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartDto) {
    return this.shoppingCartService.updateCart(Number(id), updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete cart' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: number) {
    return this.shoppingCartService.deleteCart(Number(id));
  }

  @Post(':cartId/checkout')
  @ApiOperation({ summary: 'Check out a cart' })
  @ApiResponse({ status: 200, description: 'Checkout successful' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async checkout(@Param('cartId') cartId: number) {
    return this.shoppingCartService.checkout(Number(cartId));
  }
}



