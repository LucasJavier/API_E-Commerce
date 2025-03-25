import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ enum: ['Admin', 'User'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['Admin', 'User'], { message: 'Role must be either Admin or User' }) // Validación más estricta
  role?: 'Admin' | 'User';
}
