import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Category, Product } from '@prisma/client';

// Mocks tipados correctamente
const mockPrismaService: Partial<Record<keyof PrismaService, any>> = {
  category: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
  },
};

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const dto = { name: 'Tech' };
      const category = { id: 1, name: 'Tech', updatedAt: new Date() } as Category;
      prisma.category.create.mockResolvedValue(category);

      const result = await service.create(dto);
      expect(result).toEqual(category);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: expect.objectContaining(dto),
      });
    });

    it('should throw an internal error on create failure', async () => {
      prisma.category.create.mockRejectedValue(new Error('Create failed'));
      await expect(service.create({ name: 'Tech' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [{ id: 1, name: 'Tech', updatedAt: new Date() }] as Category[];
      prisma.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();
      expect(result).toEqual(categories);
    });

    it('should throw NotFound if no categories exist', async () => {
      prisma.category.findMany.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const category = { id: 1, name: 'Tech', updatedAt: new Date() } as Category;
      prisma.category.findUnique.mockResolvedValue(category);

      const result = await service.findOne(1);
      expect(result).toEqual(category);
    });

    it('should throw NotFound if category does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a category', async () => {
      const existing = { id: 1, name: 'Tech', updatedAt: new Date() } as Category;
      const updated = { id: 1, name: 'Tech Updated', updatedAt: new Date() } as Category;

      prisma.category.findUnique.mockResolvedValue(existing);
      prisma.category.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Tech Updated' });
      expect(result).toEqual(updated);
    });

    it('should throw NotFound if category does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.update(1, { name: 'Tech' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return a category', async () => {
      const category = { id: 1, name: 'Tech', updatedAt: new Date() } as Category;
      prisma.category.findUnique.mockResolvedValue(category);
      prisma.category.delete.mockResolvedValue(category);

      const result = await service.remove(1);
      expect(result).toEqual(category);
    });

    it('should throw NotFound if category does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findProductsByCategoryId', () => {
    it('should return category and its products', async () => {
      const category = { id: 1, name: 'Tech', updatedAt: new Date() } as Category;
      const products = [{ id: 1, name: 'Laptop', categoryId: 1 }] as Product[];

      prisma.category.findUnique.mockResolvedValue(category);
      prisma.product.findMany.mockResolvedValue(products);

      const result = await service.findProductsByCategoryId(1);
      expect(result).toEqual({ category, products });
    });

    it('should throw NotFound if category does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.findProductsByCategoryId(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFound if no products are found', async () => {
      const category = { id: 1, name: 'Tech', updatedAt: new Date() } as Category;
      prisma.category.findUnique.mockResolvedValue(category);
      prisma.product.findMany.mockResolvedValue([]);

      await expect(service.findProductsByCategoryId(1)).rejects.toThrow(NotFoundException);
    });
  });
});
