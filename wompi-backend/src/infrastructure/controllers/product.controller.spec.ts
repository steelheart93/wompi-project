import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { success, failure } from '../../domain/logic/result';
import { HttpException } from '@nestjs/common';
import { Product } from '../../domain/models/product.model';

describe('ProductController', () => {
  let controller: ProductController;
  let useCase;

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: GetProductsUseCase, useValue: mockUseCase }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    useCase = module.get(GetProductsUseCase);
  });

  it('debe retornar productos', async () => {
    const products = [new Product('1', 'Test', 100, 10)];
    mockUseCase.execute.mockResolvedValue(success(products));

    const result = await controller.getProducts();
    expect(result).toBe(products);
  });

  it('debe lanzar error si falla', async () => {
    mockUseCase.execute.mockResolvedValue(failure(new Error('Error DB')));
    await expect(controller.getProducts()).rejects.toThrow(HttpException);
  });
});
