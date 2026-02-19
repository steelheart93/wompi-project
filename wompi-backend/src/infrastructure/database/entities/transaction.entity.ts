// src/infrastructure/database/entities/transaction.entity.ts
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  reference: string;

  @Column({ name: 'product_id' }) // Nombre de la columna en la BD
  productId: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column('bigint') // Usamos bigint para dinero
  amount_in_cents: number; // Snake_case es común en BD, camelCase en código

  @Column({ length: 3 })
  currency: string;

  @Column()
  customer_email: string;

  @Column()
  status: string;

  @Column({ type: 'bigint', name: 'vat_fee', default: 0 })
  vatFee: number;

  @Column()
  created_at: Date;
}
