import { Test, TestingModule } from '@nestjs/testing';
import { ItemOrderService } from './item-order.service';
import { CreateItemOrderDto } from './dto/create-item-order.dto';
import { UpdateItemOrderDto } from './dto/update-item-order.dto';

describe('ItemOrderService', () => {
  let service: ItemOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemOrderService],
    }).compile();

    service = module.get<ItemOrderService>(ItemOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a creation message', () => {
      const dto: CreateItemOrderDto = { /* datos de ejemplo */ };
      const result = service.create(dto);
      expect(result).toBe('This action adds a new itemOrder');
    });
  });

  describe('findAll', () => {
    it('should return all itemOrders message', () => {
      expect(service.findAll()).toBe('This action returns all itemOrder');
    });
  });

  describe('findOne', () => {
    it('should return the itemOrder with the given id', () => {
      expect(service.findOne(1)).toBe('This action returns a #1 itemOrder');
    });
  });

  describe('update', () => {
    it('should return an update message for the given id', () => {
      const dto: UpdateItemOrderDto = { /* datos de ejemplo */ };
      expect(service.update(1, dto)).toBe('This action updates a #1 itemOrder');
    });
  });

  describe('remove', () => {
    it('should return a remove message for the given id', () => {
      expect(service.remove(1)).toBe('This action removes a #1 itemOrder');
    });
  });
});

