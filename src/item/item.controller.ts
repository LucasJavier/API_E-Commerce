import { Controller, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { CreateItemDto } from '../item/dto/create-item';
import { UpdateItemDto } from '../item/dto/update-item';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiBody({ description: 'Data to add a product to the cart', type: CreateItemDto })
  @ApiResponse({ status: 201, description: 'Product successfully added to the cart' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async addProductToCart(@Body() createItemDto: CreateItemDto) {
    return this.itemService.addItemToCart(createItemDto);
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove a product from the cart' })
  @ApiBody({ description: 'Data to remove a product from the cart', type: Object })
  @ApiResponse({ status: 200, description: 'Product successfully removed from the cart' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async removeProductFromCart(@Body() body: { cartId: number; productId: number }) {
    return this.itemService.removeItemFromCart(body.cartId, body.productId);
  }
  
  @Put('update')
  @ApiOperation({ summary: 'Update the quantity of a product in the cart' })
  @ApiBody({ description: 'Data to update the quantity of a product', type: UpdateItemDto })
  @ApiResponse({ status: 200, description: 'Product quantity successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'Product not found in cart' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateItemQuantity(@Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItemQuantity(
      updateItemDto,
      updateItemDto.cartId,
      updateItemDto.productId,
    );
  }
}


