// src/infrastructure/adapters/transaction.repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../domain/ports/transaction.repository';
import { Transaction } from '../../domain/models/transaction.model';
import { TransactionEntity } from '../database/entities/transaction.entity';
import { Result, success, failure } from '../../domain/logic/result';

@Injectable()
export class TransactionRepositoryAdapter implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly typeOrmRepo: Repository<TransactionEntity>,
  ) {}

  private toDomain(entity: TransactionEntity): Transaction {
    // Nota: TypeORM a veces devuelve strings para columnas bigint
    return new Transaction(
      entity.id,
      entity.reference,
      entity.productId,
      Number(entity.amount_in_cents),
      entity.currency,
      entity.customer_email,
      entity.status as any,
      entity.created_at,
      entity.vatFee, // <--- NUEVO CAMPO VAT FEE
    );
  }

  async save(transaction: Transaction): Promise<Result<Transaction>> {
    try {
      const entity = this.typeOrmRepo.create({
        id: transaction.id,
        reference: transaction.reference,
        productId: transaction.productId,
        amount_in_cents: transaction.totalAmountInCents,
        currency: transaction.currency,
        customer_email: transaction.customerEmail,
        status: transaction.status,
        created_at: transaction.createdAt,
        vatFee: transaction.vatFee, // <--- NUEVO CAMPO VAT FEE
      });
      await this.typeOrmRepo.save(entity);
      return success(transaction);
    } catch (error) {
      return failure(error);
    }
  }

  async findByReference(reference: string): Promise<Result<Transaction>> {
    try {
      const entity = await this.typeOrmRepo.findOne({ where: { reference } });
      if (!entity) return failure(new Error('Transaction not found'));
      return success(this.toDomain(entity));
    } catch (error) {
      return failure(error);
    }
  }
}
