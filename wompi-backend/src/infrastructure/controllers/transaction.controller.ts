// src/infrastructure/controllers/transaction.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as createTransactionUseCase_1 from '../../application/use-cases/create-transaction.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: createTransactionUseCase_1.CreateTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() body: createTransactionUseCase_1.CreateTransactionDto) {
    /* Body esperado:
      {
        "productId": "...",
        "customerEmail": "juan@example.com",
        "paymentSourceId": 12345,
        "installments": 1,
        "deliveryAddress": "Calle 123"
      }
    */

    const result = await this.createTransactionUseCase.execute(body);

    if (result.success) {
      return {
        message: 'Purchase successful',
        data: result.value,
      };
    } else {
      // Aquí decidimos qué código HTTP devolver según el error
      const errorMsg =
        result.error instanceof Error ? result.error.message : 'Unknown error';

      if (errorMsg === 'Insufficient stock') {
        throw new HttpException(errorMsg, HttpStatus.CONFLICT);
      } else if (errorMsg.includes('Declined')) {
        throw new HttpException(errorMsg, HttpStatus.PAYMENT_REQUIRED); // 402
      } else {
        throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
