// src/pages/ResultPage.tsx
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { resetTransaction } from "../features/transaction/transactionSlice";
import "./ResultPage.css";

export const ResultPage = () => {
  const dispatch = useAppDispatch();
  const { transactionResult, error } = useAppSelector(
    (state) => state.transaction,
  );

  const isSuccess = !!transactionResult && !error;

  return (
    <div className="result-container">
      <div className={`icon-wrapper ${isSuccess ? "success" : "error"}`}>
        {isSuccess ? "🎉" : "⚠️"}
      </div>

      <h1 className="result-title">
        {isSuccess ? "¡Pago Exitoso!" : "Hubo un problema"}
      </h1>

      <p className="result-message">
        {isSuccess
          ? "Gracias por tu compra. Hemos enviado los detalles a tu correo."
          : error || "No pudimos procesar tu transacción."}
      </p>

      {isSuccess && transactionResult?.reference && (
        <div className="reference-box">Ref: {transactionResult.reference}</div>
      )}

      <button className="home-btn" onClick={() => dispatch(resetTransaction())}>
        Volver a la Tienda
      </button>
    </div>
  );
};
