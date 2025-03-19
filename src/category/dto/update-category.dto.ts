import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
    @ApiProperty({
        description: 'Nuevo nombre de la categoría',
        example: 'Electrónica',
      })
    @IsString()
    @IsNotEmpty()
    name: string;
}