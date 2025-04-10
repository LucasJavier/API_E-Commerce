import { Test, TestingModule } from '@nestjs/testing';
import { ProducttrackingService } from './producttracking.service';

describe('ProducttrackingService', () => {
  let service: ProducttrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducttrackingService],
    }).compile();

    service = module.get<ProducttrackingService>(ProducttrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
