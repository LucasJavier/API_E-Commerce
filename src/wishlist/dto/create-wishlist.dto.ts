import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @ApiProperty({
        description: 'The name of the wishlist',
        example: 'My Birthday Wishlist'
    })
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @ApiProperty({
        description: 'The description of the wishlist',
        example: 'This is a wishlist for my birthday. Please buy me something from here!'
    })
    description: string;
}
