// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infrastructure/database/entities/product.entity';
import { ProductRepositoryAdapter } from './infrastructure/adapters/product.repository.adapter';
import { DbSeedService } from './infrastructure/database/seeds/db-seed.service';
import { ProductController } from './infrastructure/controllers/product.controller';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { TransactionEntity } from './infrastructure/database/entities/transaction.entity';
import { TransactionRepositoryAdapter } from './infrastructure/adapters/transaction.repository.adapter';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { WompiAdapter } from './infrastructure/adapters/wompi.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'wompi_user',
      password: 'wompi_password',
      database: 'wompi_db',
      entities: [ProductEntity, TransactionEntity],
      synchronize: true, // ¡SOLO EN DESARROLLO! Crea las tablas automágicamente
    }),
    TypeOrmModule.forFeature([ProductEntity, TransactionEntity]),
  ],
  controllers: [ProductController, TransactionController],
  providers: [
    DbSeedService,
    GetProductsUseCase,
    CreateTransactionUseCase,
    {
      provide: 'IProductRepository',
      useClass: ProductRepositoryAdapter,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepositoryAdapter,
    },
    {
      provide: 'IPaymentGateway',
      useClass: WompiAdapter,
    },
  ],
})
export class AppModule {}
