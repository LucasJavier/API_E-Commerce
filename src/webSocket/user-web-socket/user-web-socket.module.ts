import { Module } from '@nestjs/common';
import { UserWebSocketGateway } from './user-web-socket.gateway';
import { ProductTrackingModule } from 'src/product-tracking/producttracking.module';
import { CognitoAuthModule } from 'src/cognito-auth/cognitoAuth.module';
import { GuardRolesModule } from 'src/guard-roles/guard-roles.module';

@Module({
  imports: [ProductTrackingModule, CognitoAuthModule, GuardRolesModule],
  providers: [UserWebSocketGateway],
})
export class UserWebSocketModule {}