// src/domain/ports/product.repository.ts
import { Product } from '../models/product.model';
import { Result } from '../logic/result';

export interface IProductRepository {
  findAll(): Promise<Result<Product[]>>;
  findById(id: string): Promise<Result<Product>>;
  updateStock(id: string, newStock: number): Promise<Result<boolean>>;
  save(product: Product): Promise<Result<Product>>;
}
