import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductToWishlistDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'The product ID to add to the wishlist',
        example: 1
    })
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @ApiProperty({
        description: 'The wishlist ID to add the product to',
        example: 1
    })
    wishlistId: number;
}