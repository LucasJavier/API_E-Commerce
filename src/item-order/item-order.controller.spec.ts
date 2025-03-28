import { Test, TestingModule } from '@nestjs/testing';
import { ItemOrderController } from './item-order.controller';
import { ItemOrderService } from './item-order.service';

describe('ItemOrderController', () => {
  let controller: ItemOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemOrderController],
      providers: [ItemOrderService],
    }).compile();

    controller = module.get<ItemOrderController>(ItemOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
