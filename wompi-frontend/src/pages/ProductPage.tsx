// src/pages/ProductPage.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setProduct, setStep } from "../features/transaction/transactionSlice";
import axios from "axios";
import { API_URL } from "../config";
import "./ProductPage.css";

export const ProductPage = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.transaction.product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);

        if (response.data && response.data.length > 0) {
          dispatch(setProduct(response.data[0]));
        }
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };
    fetchProduct();
  }, [dispatch]);

  if (!product) return <div>Cargando tienda...</div>;

  return (
    <div className="product-container">
      <div className="product-image">📱</div>
      <h1 className="product-title">{product.name}</h1>
      <div className="product-price">
        ${(product.price / 100).toLocaleString("es-CO")} COP
      </div>
      <p className="product-stock">Disponibles: {product.stock}</p>

      <button className="pay-button" onClick={() => dispatch(setStep("FORM"))}>
        Pagar con Wompi
      </button>
    </div>
  );
};
