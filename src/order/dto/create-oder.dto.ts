import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID del carrito', example: 1 })
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({ description: 'ID del usuario', example: 'abc123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Lista de productos en la orden' })
  @IsArray()
  @IsNotEmpty()
  items: { productId: number; quantity: number; price: number }[];
}

