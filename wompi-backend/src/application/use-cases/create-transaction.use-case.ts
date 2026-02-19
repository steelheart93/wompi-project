// src/application/use-cases/create-transaction.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import * as productRepository from '../../domain/ports/product.repository';
import * as transactionRepository from '../../domain/ports/transaction.repository';
import * as paymentGatewayPort from '../../domain/ports/payment-gateway.port';
import { Result, success, failure } from '../../domain/logic/result';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/models/transaction.model';
import { v4 as uuidv4 } from 'uuid';

// Definimos qué datos necesitamos recibir del Controlador
export interface CreateTransactionDto {
  productId: string;
  customerEmail: string;
  paymentSourceId: number; // Token de la tarjeta
  installments: number;
  deliveryAddress: string; // Aunque no lo guardemos en Transaction por ahora, es parte del requerimiento
  vatFee: number; // Nuevo campo para el IVA
}

@Injectable()
export class CreateTransactionUseCase {
  // Constantes de negocio (podrían ir en configs)
  private readonly DELIVERY_FEE = 1000000; // $10,000 COP (en centavos)

  constructor(
    @Inject('IProductRepository')
    private readonly productRepo: productRepository.IProductRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepo: transactionRepository.ITransactionRepository,
    @Inject('IPaymentGateway')
    private readonly paymentGateway: paymentGatewayPort.IPaymentGateway,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Result<Transaction>> {
    // 1. Validar Producto y Stock
    const productResult = await this.productRepo.findById(dto.productId);
    if (!productResult.success) return failure(new Error('Product not found'));

    const product = productResult.value;
    if (!product.hasStock(1)) {
      return failure(new Error('Insufficient stock'));
    }

    // 2. NUEVO: Calcular IVA (19%) y Total Actualizado
    // Calculamos el 19% sobre el precio del producto
    const vatFee = Math.round(product.price * 0.19);
    // El total ahora incluye: Precio + Envío + IVA
    const totalAmount = product.price + this.DELIVERY_FEE + vatFee;

    const reference = `ORD-${uuidv4().split('-')[0]}-${Date.now()}`;

    // 3. Crear Transacción PENDIENTE (Agregamos el vatFee al objeto)
    const newTransaction = new Transaction(
      uuidv4(),
      reference,
      product.id,
      totalAmount,
      'COP',
      dto.customerEmail,
      'PENDING',
      new Date(),
      vatFee, // <--- NUEVO: Guardamos el valor del IVA en la transacción
    );

    // Guardamos estado inicial
    const saveResult = await this.transactionRepo.save(newTransaction);
    if (!saveResult.success)
      return failure(new Error('Could not create transaction record'));

    // 4. Intentar Cobrar con Wompi (Enviamos el total que ya incluye el IVA)
    const paymentResult = await this.paymentGateway.processPayment({
      amountInCents: totalAmount,
      currency: 'COP',
      customerEmail: dto.customerEmail,
      reference: reference,
      paymentSourceId: dto.paymentSourceId,
    });

    // 5. Manejar Respuesta de Wompi
    if (paymentResult.success && paymentResult.value.status === 'APPROVED') {
      // ÉXITO: Actualizamos transacción y reduciomos stock
      newTransaction.status = 'APPROVED';
      await this.transactionRepo.save(newTransaction);
      await this.productRepo.updateStock(product.id, product.stock - 1);
      return success(newTransaction);
    } else {
      // FALLO: Actualizamos transacción a DECLINED o ERROR
      newTransaction.status = paymentResult.success
        ? paymentResult.value.status === 'DECLINED'
          ? 'DECLINED'
          : 'ERROR'
        : 'ERROR';

      await this.transactionRepo.save(newTransaction);

      // Retornamos Failure para que el Controller sepa que no se vendió
      const errorMsg = !paymentResult.success
        ? 'Payment Gateway Error'
        : `Payment Declined: ${paymentResult.value.statusMessage || 'Unknown reason'}`;

      return failure(new Error(errorMsg));
    }
  }
}
