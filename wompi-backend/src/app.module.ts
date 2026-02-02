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
      // 👇 Si existe DATABASE_URL (Render), la usa. Si no, usa los datos locales.
      url: process.env.DATABASE_URL,

      // Mantenemos estos por si corres el proyecto local sin Docker
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'wompi_user',
      password: process.env.DB_PASSWORD || 'wompi_password',
      database: process.env.DB_DATABASE || 'wompi_db',

      entities: [ProductEntity, TransactionEntity],
      synchronize: true,
      // Importante para conexiones en la nube (Render lo requiere a veces)
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
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
