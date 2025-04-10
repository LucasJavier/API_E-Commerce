import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemovePoductFromWishlistDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'The product ID to remove to the wishlist',
        example: 1
    })
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'The wishlist ID to remove the product to',
        example: 1
    })
    wishlistId: number;
}