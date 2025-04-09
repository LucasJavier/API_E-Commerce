import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'ID del carrito al que pertenece el item'
  })
  @IsInt()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({
    description: 'ID del producto agregado al carrito'
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Cantidad del producto en el carrito'
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
