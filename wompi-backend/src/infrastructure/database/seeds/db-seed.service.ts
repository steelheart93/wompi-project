// src/infrastructure/database/seeds/db-seed.service.ts
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as productRepository from '../../../domain/ports/product.repository';
import { Product } from '../../../domain/models/product.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DbSeedService implements OnModuleInit {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepo: productRepository.IProductRepository,
  ) {}

  async onModuleInit() {
    const result = await this.productRepo.findAll();
    if (result.success && result.value.length === 0) {
      console.log('🌱 Seeding database...');
      const product = new Product(uuidv4(), 'iPhone 15 Pro', 3500000, 5);
      await this.productRepo.save(product);
      console.log('✅ Product created!');
    }
  }
}
