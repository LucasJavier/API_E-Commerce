import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty()
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}
