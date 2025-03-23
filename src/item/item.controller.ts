import { Controller, Post, Body, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { CreateItemDto } from '../item/dto/create-item';
import { UpdateItemDto } from '../item/dto/update-item';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('add')
  @ApiOperation({ summary: 'Agregar un producto al carrito' })
  @ApiBody({
    description: 'Datos para agregar un producto al carrito',
    type: CreateItemDto,
  })
  async addProductToCart(@Body() createItemDto: CreateItemDto) {
    return this.itemService.addItemToCart(createItemDto);
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Eliminar un producto del carrito' })
  @ApiBody({
    description: 'Datos para eliminar un producto del carrito',
    schema: {
      type: 'object',
      properties: {
        cartId: { type: 'number', example: 1 },
        productId: { type: 'number', example: 10 },
      },
    },
  })
  async removeProductFromCart(@Body() body: { cartId: number; productId: number }) {
    return this.itemService.removeItemFromCart(body.cartId, body.productId);
  }
  
  @Put('update')
  @ApiOperation({ summary: 'Actualizar la cantidad de un producto en el carrito' })
  @ApiBody({
    description: 'Datos para actualizar la cantidad de un producto',
    type: UpdateItemDto,
  })
  async updateItemQuantity(@Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItemQuantity(
      updateItemDto,
      updateItemDto.cartId,
      updateItemDto.productId,
    );
  }
}


