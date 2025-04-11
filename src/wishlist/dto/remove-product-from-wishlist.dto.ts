import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RemovePoductFromWishlistDto {
    @Type(() => Number) 
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'The product ID to remove to the wishlist',
        example: 1
    })
    productId: number;

    @Type(() => Number) 
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'The wishlist ID to remove the product to',
        example: 1
    })
    wishlistId: number;
}