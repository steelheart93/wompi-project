import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from './get-products.use-case';
import { Product } from '../../domain/models/product.model';
import { success } from '../../domain/logic/result';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let productRepo;

  const mockProductRepo = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsUseCase,
        { provide: 'IProductRepository', useValue: mockProductRepo },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
    productRepo = module.get('IProductRepository');
  });

  it('debe retornar una lista de productos', async () => {
    const products = [new Product('1', 'Test', 100, 10)];
    mockProductRepo.findAll.mockResolvedValue(success(products));

    const result = await useCase.execute();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].name).toBe('Test');
    }
  });
});
