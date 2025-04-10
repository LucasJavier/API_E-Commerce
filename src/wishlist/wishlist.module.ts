import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { CognitoAuthModule } from 'src/cognito-auth/cognitoAuth.module';

@Module({
  imports: [CognitoAuthModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
