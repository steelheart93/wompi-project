// src/application/use-cases/get-products.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import * as productRepository from '../../domain/ports/product.repository';
import { Result } from '../../domain/logic/result';
import { Product } from '../../domain/models/product.model';

@Injectable()
export class GetProductsUseCase {
  constructor(
    // Inyectamos la Interfaz, no la implementación concreta
    @Inject('IProductRepository')
    private readonly productRepo: productRepository.IProductRepository,
  ) {}

  async execute(): Promise<Result<Product[]>> {
    // Aquí podrías poner lógica extra (ej: filtrar solo activos),
    // pero por ahora solo delegamos al repositorio.
    return await this.productRepo.findAll();
  }
}
