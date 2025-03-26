import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ description: 'Nombre del producto', example: 'Zapatilla' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Descripción del producto', example: 'Zapatilla de deporte' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Precio del producto', example: 15000 })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) // 👈 Convierte el valor a número
    price: number;

    @ApiProperty({ description: 'Stock del producto', example: 10 })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) // 👈 Convierte el valor a número
    stock: number;

    @ApiProperty({ description: 'Categoría del producto', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value)) // 👈 Convierte el valor a número
    categoryId: number;
}

