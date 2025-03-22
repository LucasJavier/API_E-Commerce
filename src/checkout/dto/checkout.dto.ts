import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CheckoutItemDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ description: 'Cantidad solicitada', example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @ApiProperty({ description: 'ID del carrito', example: 1 })
  @IsInt()
  cartId: number;

  @ApiProperty({
    description: 'Lista de productos con sus cantidades',
    type: [CheckoutItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
