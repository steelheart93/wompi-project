// src/pages/SummaryPage.tsx
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  setTransactionSuccess,
  setTransactionError,
} from "../features/transaction/transactionSlice";
import axios from "axios";
import { API_URL } from "../config";
import "./SummaryPage.css";

export const SummaryPage = () => {
  const dispatch = useAppDispatch();
  const { product, deliveryData, cardToken } = useAppSelector(
    (state) => state.transaction,
  );
  const [processing, setProcessing] = useState(false);
  const DELIVERY_FEE = 10000;

  if (!product) return null;

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await axios.post(`${API_URL}/transactions`, {
        productId: product.id,
        customerEmail: deliveryData.email,
        paymentSourceId: cardToken,
        installments: 1,
        deliveryAddress: deliveryData.address,
      });

      dispatch(setTransactionSuccess(response.data.data));
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Error desconocido";
      dispatch(setTransactionError(msg));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="summary-container">
      <h2>Resumen de Compra</h2>
      <div className="summary-item">
        <span>Producto</span>
        <span>${(product.price / 100).toLocaleString("es-CO")}</span>
      </div>
      <div className="summary-item">
        <span>Envío</span>
        <span>${DELIVERY_FEE.toLocaleString("es-CO")}</span>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <span>
          ${(product.price / 100 + DELIVERY_FEE).toLocaleString("es-CO")}
        </span>
      </div>
      <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#666" }}>
        <p>Entregar a: {deliveryData.email}</p>
        <p>Dirección: {deliveryData.address}</p>
      </div>
      <button
        className="confirm-btn"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing ? "Procesando pago..." : "Pagar Ahora"}
      </button>
    </div>
  );
};
