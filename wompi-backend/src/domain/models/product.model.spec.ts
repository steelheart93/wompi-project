// src/domain/models/product.model.spec.ts
import { Product } from './product.model';

describe('Product Model', () => {
  it('debe retornar true si hay stock suficiente', () => {
    const product = new Product('1', 'Test', 100, 10);
    expect(product.hasStock(5)).toBe(true);
  });

  it('debe retornar false si no hay stock suficiente', () => {
    const product = new Product('1', 'Test', 100, 2);
    expect(product.hasStock(5)).toBe(false);
  });
});
