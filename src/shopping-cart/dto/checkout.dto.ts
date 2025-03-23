import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsNotEmpty } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ description: 'ID del carrito' })
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({ description: 'Lista de productos en el carrito' })
  @IsArray()
  @IsNotEmpty()
  items: { productId: number; quantity: number; price: number }[];
}

