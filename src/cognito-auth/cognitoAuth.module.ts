import { Module } from '@nestjs/common';
import { CognitoAuthService } from './cognitoAuth.service';
import { CognitoAuthController } from './cognitoAuth.controller';
import { JwtAuthGuard } from './cognito-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';   
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule],
  controllers: [CognitoAuthController],
  providers: [CognitoAuthService, JwtAuthGuard, ConfigService],
  exports: [JwtAuthGuard],
})
export class CognitoAuthModule {}
