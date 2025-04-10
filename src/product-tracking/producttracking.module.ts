import { Module } from '@nestjs/common';
import { ProductTrackingService } from './producttracking.service';

@Module({
  providers: [ProductTrackingService],
  exports: [ProductTrackingService],
})
export class ProductTrackingModule {}