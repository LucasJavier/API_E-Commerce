import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Nombre de la categoría',
        example: 'Tecnología',
      })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;
}