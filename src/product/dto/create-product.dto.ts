import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Zapatilla',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Descripción del producto',
        example: 'Zapatilla de deporte',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Precio del producto',
        example: 15000,
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        description: 'Stock del producto',
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @ApiProperty({
        description: 'Imagen del producto',
        example: '',
    })

    @ApiProperty({
        description: 'Categoría del producto',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}