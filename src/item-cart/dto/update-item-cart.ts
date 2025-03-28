import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ description: 'ID del carrito', example: 1 })
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({ description: 'ID del producto', example: 42 })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'Nueva cantidad del producto en el carrito', example: 3 })
  @IsInt()
  @Min(1)
  quantity: number;
}

