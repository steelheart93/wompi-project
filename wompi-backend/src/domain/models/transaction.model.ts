// src/domain/models/transaction.model.ts
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly reference: string, // Referencia única para Wompi
    public readonly productId: string,
    public readonly totalAmountInCents: number, // Siempre manejamos dinero en enteros (centavos)
    public readonly currency: string, // 'COP'
    public readonly customerEmail: string,
    public status: TransactionStatus,
    public readonly createdAt: Date,
    public readonly vatFee: number, // <--- NUEVO: Agregamos el campo para el IVA
  ) {}
}
