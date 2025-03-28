import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductImageDto {
    @ApiProperty({
        description: 'Product image file',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty()
    image: any;
}
