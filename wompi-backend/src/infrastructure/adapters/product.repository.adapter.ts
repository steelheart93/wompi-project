// src/infrastructure/adapters/product.repository.adapter.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../domain/ports/product.repository'; // Puerto (Contrato)
import { Product } from '../../domain/models/product.model'; // Modelo de Dominio
import { ProductEntity } from '../database/entities/product.entity'; // Entidad de DB
import { Result, success, failure } from '../../domain/logic/result';

@Injectable()
export class ProductRepositoryAdapter implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly typeOrmRepo: Repository<ProductEntity>,
  ) {}

  // Convertimos de Entidad de DB -> Modelo de Dominio
  private toDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      Number(entity.price),
      entity.stock,
    );
  }

  async save(product: Product): Promise<Result<Product>> {
    try {
      const entity = this.typeOrmRepo.create({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
      await this.typeOrmRepo.save(entity);
      return success(product);
    } catch (error) {
      return failure(error);
    }
  }

  async findAll(): Promise<Result<Product[]>> {
    try {
      const entities = await this.typeOrmRepo.find();
      const products = entities.map((e) => this.toDomain(e));
      return success(products);
    } catch (error) {
      return failure(error);
    }
  }

  async findById(id: string): Promise<Result<Product>> {
    try {
      const entity = await this.typeOrmRepo.findOne({ where: { id } });
      if (!entity) return failure(new Error('Product not found'));
      return success(this.toDomain(entity));
    } catch (error) {
      return failure(error);
    }
  }

  async updateStock(id: string, newStock: number): Promise<Result<boolean>> {
    try {
      await this.typeOrmRepo.update(id, { stock: newStock });
      return success(true);
    } catch (error) {
      return failure(error);
    }
  }
}
