import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID del usuario al que pertenece el carrito',
    example: 'cognito-user-sub-id',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
