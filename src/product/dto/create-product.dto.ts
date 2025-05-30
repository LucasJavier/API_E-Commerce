import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Name of the product',
        example: 'Shoes',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @ApiProperty({
        description: 'Description of the product',
        example: 'Comfortable shoes for running',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 15000,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Transform(({ value }) => Number(value))
    price: number;

    @ApiProperty({
        description: 'Stock of the product',
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Transform(({ value }) => Number(value))
    stock: number;

    @ApiProperty({
        description: 'Category ID of the product',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Transform(({ value }) => Number(value))
    categoryId: number;
}

