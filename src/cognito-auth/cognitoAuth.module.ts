import { Module } from '@nestjs/common';
import { CognitoAuthService } from './cognitoAuth.service';
import { CognitoAuthController } from './cognitoAuth.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CognitoAuthController],
  providers: [CognitoAuthService, PrismaService],
})
export class CognitoAuthModule {}
