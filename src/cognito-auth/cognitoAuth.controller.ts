import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CognitoAuthService } from './cognitoAuth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { ConfirmAuthDto } from './dto/confirm.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('cognito-auth')
export class CognitoAuthController {
  constructor(private readonly authService: CognitoAuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.signUp(registerDto);
  }

  @Post('confirm')
  confirm(@Body() confirmDto: ConfirmAuthDto) {
    return this.authService.confirmSignUp(confirmDto);
  }

  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto);
  }
}
