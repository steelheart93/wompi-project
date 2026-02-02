// src/domain/ports/transaction.repository.ts
import { Transaction } from '../models/transaction.model';
import { Result } from '../logic/result';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Result<Transaction>>;
  findByReference(reference: string): Promise<Result<Transaction>>;
}
