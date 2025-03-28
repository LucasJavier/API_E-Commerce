import { Module } from '@nestjs/common';
import { ItemOrderService } from './item-order.service';
import { ItemOrderController } from './item-order.controller';

@Module({
  controllers: [ItemOrderController],
  providers: [ItemOrderService],
})
export class ItemOrderModule {}
