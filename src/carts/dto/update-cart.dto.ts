import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    description: 'ID del usuario (opcional)',
    example: 'cognito-user-sub-id',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
