import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({}),
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
  };
});

describe('ProductService', () => {
  let service: ProductService;
  let prisma: any;
  let s3Client: S3Client;

  beforeEach(async () => {
    prisma = {
      product: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    s3Client = new S3Client({ region: 'us-east-1' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'desc',
        stock: 10,
        categoryId: 1,
      };

      const mockProduct = { id: 1, ...createProductDto, imageUrl: null, imageKey: null };
      prisma.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: expect.objectContaining(createProductDto),
      });
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 100 };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1 }, { id: 2 }];
      prisma.product.findMany.mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
    });

    it('should throw NotFoundException if no products found', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const updateProductDto = { name: 'Updated Product' };
      const mockProduct = { id: 1, ...updateProductDto };
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.update.mockResolvedValue(mockProduct);

      const result = await service.updateProduct(1, updateProductDto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.updateProduct(1, { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateImageProduct', () => {
    it('should update product image', async () => {
      const mockProduct = { id: 1, imageKey: 'old-key' };
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.update.mockResolvedValue({ ...mockProduct, imageKey: 'new-key', imageUrl: 'url' });

      const mockFile = { originalname: 'test.jpg', buffer: Buffer.from(''), mimetype: 'image/jpeg' } as any;

      const result = await service.updateImageProduct(1, mockFile);
      expect(result.imageKey).toEqual('new-key');
      expect(prisma.product.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    
    it('should delete a product successfully', async () => {
      const mockProduct = { id: 1, name: 'Test Product', imageKey: 'test-key' };
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(1);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateStock', () => {
    it('should throw an error if stock is insufficient', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, stock: 2 });
      await expect(service.validateStock([{ productId: 1, quantity: 3 }]))
        .rejects.toThrowError('Insufficient stock for product ID 1');
    });

    it('should pass if stock is sufficient', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, stock: 10 });
      await expect(service.validateStock([{ productId: 1, quantity: 5 }])).resolves.toBeUndefined();
    });
  });

  describe('updateStock', () => {
    it('should decrement stock for each item', async () => {
      prisma.product.update.mockResolvedValue({});
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ];

      await service.updateStock(items);

      expect(prisma.product.update).toHaveBeenCalledTimes(2);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stock: { decrement: 2 } },
      });
    });
  });
});