// src/infrastructure/controllers/product.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';

@Controller('products')
export class ProductController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  async getProducts() {
    const result = await this.getProductsUseCase.execute();

    // ROP en acción: Verificamos el resultado sin try-catch
    if (result.success) {
      return result.value; // Devuelve el JSON con los productos
    } else {
      // Si falló, convertimos el error de dominio a error HTTP
      throw new HttpException(
        result.error instanceof Error ? result.error.message : 'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
