import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Cart ID'})
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'List of products in the order' })
  @IsArray()
  @IsNotEmpty()
  items: { productId: number; quantity: number; price: number }[];
}

