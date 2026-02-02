// src/domain/models/product.model.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}

  // Lógica de negocio pura: Validar si hay stock
  hasStock(units: number): boolean {
    return this.stock >= units;
  }
}
