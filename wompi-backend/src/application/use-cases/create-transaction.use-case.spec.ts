// src/application/use-cases/create-transaction.use-case.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { Product } from '../../domain/models/product.model';
import { Transaction } from '../../domain/models/transaction.model';
import { success, failure } from '../../domain/logic/result';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let productRepo;
  let transactionRepo;
  let paymentGateway;

  // Mocks: Funciones falsas para simular la BD y Wompi
  const mockProductRepo = {
    findById: jest.fn(),
    updateStock: jest.fn(),
  };
  const mockTransactionRepo = {
    save: jest.fn(),
  };
  const mockPaymentGateway = {
    processPayment: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpiar llamadas previas

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        // Inyectamos los mocks usando los mismos Tokens ('String') que en el módulo real
        { provide: 'IProductRepository', useValue: mockProductRepo },
        { provide: 'ITransactionRepository', useValue: mockTransactionRepo },
        { provide: 'IPaymentGateway', useValue: mockPaymentGateway },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    productRepo = module.get('IProductRepository');
    transactionRepo = module.get('ITransactionRepository');
    paymentGateway = module.get('IPaymentGateway');
  });

  it('debe crear una transacción exitosa si hay stock y el pago es aprobado', async () => {
    // 1. Arrange (Preparar datos)
    const product = new Product('prod-1', 'iPhone', 1000, 5); // Stock 5
    productRepo.findById.mockResolvedValue(success(product));
    transactionRepo.save.mockResolvedValue(success(true));
    paymentGateway.processPayment.mockResolvedValue(
      success({ id: 'tx-123', status: 'APPROVED' }),
    );
    productRepo.updateStock.mockResolvedValue(success(true));

    // 2. Act (Ejecutar)
    const result = await useCase.execute({
      productId: 'prod-1',
      customerEmail: 'test@test.com',
      paymentSourceId: 123,
      installments: 1,
      deliveryAddress: 'Calle Falsa',
    });

    // 3. Assert (Verificar)
    expect(result.success).toBe(true);
    expect(transactionRepo.save).toHaveBeenCalled(); // Se guardó la transacción
    expect(productRepo.updateStock).toHaveBeenCalledWith('prod-1', 4); // El stock bajó a 4
  });

  it('debe fallar si no hay stock suficiente', async () => {
    // 1. Arrange
    const product = new Product('prod-1', 'iPhone', 1000, 0); // Stock 0
    productRepo.findById.mockResolvedValue(success(product));

    // 2. Act
    const result = await useCase.execute({
      productId: 'prod-1',
      customerEmail: 'test@test.com',
      paymentSourceId: 123,
      installments: 1,
      deliveryAddress: 'Calle Falsa',
    });

    // 3. Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      // TypeScript guard
      expect(result.error.message).toBe('Insufficient stock');
    }
    expect(paymentGateway.processPayment).not.toHaveBeenCalled(); // No debió llamar a Wompi
  });
});
