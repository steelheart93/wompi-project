// src/infrastructure/controllers/transaction.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { success, failure } from '../../domain/logic/result';
import { HttpException } from '@nestjs/common';

describe('TransactionController', () => {
  let controller: TransactionController;
  let useCase: CreateTransactionUseCase;

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: CreateTransactionUseCase, useValue: mockUseCase }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
  });

  it('debe retornar 201 y datos si la compra es exitosa', async () => {
    const mockTx = { id: '123', status: 'APPROVED' };
    mockUseCase.execute.mockResolvedValue(success(mockTx));

    const result = await controller.create({} as any);

    expect(result).toEqual({
      message: 'Purchase successful',
      data: mockTx,
    });
  });

  it('debe lanzar HttpException si falla', async () => {
    mockUseCase.execute.mockResolvedValue(
      failure(new Error('Insufficient stock')),
    );

    await expect(controller.create({} as any)).rejects.toThrow(HttpException);
  });
});
