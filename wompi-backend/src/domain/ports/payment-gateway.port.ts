// src/domain/ports/payment-gateway.port.ts
import { Result } from '../logic/result';

export interface PaymentRequest {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  reference: string; // Referencia única nuestra
  paymentSourceId: number; // ID de la fuente de pago (Token de tarjeta)
  // Datos extra para el hash de integridad si fuera necesario
}

export interface PaymentResponse {
  id: string; // ID de la transacción en Wompi
  status: 'APPROVED' | 'DECLINED' | 'ERROR';
  statusMessage?: string;
}

export interface IPaymentGateway {
  processPayment(request: PaymentRequest): Promise<Result<PaymentResponse>>;
}
