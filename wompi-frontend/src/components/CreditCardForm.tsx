// src/components/CreditCardForm.tsx
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import {
  setCardToken,
  setDeliveryData,
  setStep,
} from "../features/transaction/transactionSlice";
import { tokenizeCard } from "../services/wompi.service";
import "./CreditCardForm.css";

export const CreditCardForm = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    number: "",
    name: "",
    expiry: "", // Formato MM/YY
    cvc: "",
    email: "",
    address: "",
  });

  // Detectar franquicia (Simple regex)
  const getCardType = (number: string) => {
    if (/^4/.test(number)) return "VISA";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Lógica básica para formatear (puedes mejorarla)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Separar fecha MM/YY
      const [expMonth, expYear] = formData.expiry.split("/");

      if (
        !expMonth ||
        !expYear ||
        expMonth.length !== 2 ||
        expYear.length !== 2
      ) {
        throw new Error("Fecha inválida. Usa formato MM/YY");
      }

      // 2. Tokenizar con Wompi
      const token = await tokenizeCard({
        number: formData.number.replace(/\s/g, ""), // Quitamos espacios
        cvc: formData.cvc,
        expMonth,
        expYear,
        cardHolder: formData.name,
      });

      // 3. Guardar en Redux y avanzar
      dispatch(setCardToken(token));
      dispatch(
        setDeliveryData({ email: formData.email, address: formData.address }),
      );
      dispatch(setStep("SUMMARY")); // Vamos al resumen antes de pagar
    } catch (err: any) {
      setError(err.message || "Error procesando la tarjeta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h3>Datos de Entrega</h3>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          required
          type="email"
          name="email"
          className="form-input"
          placeholder="juan@ejemplo.com"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Dirección</label>
        <input
          required
          type="text"
          name="address"
          className="form-input"
          placeholder="Calle 123 # 45-67"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>

      <h3>Pago Seguro</h3>
      <div className="form-group">
        <label className="form-label">Número de Tarjeta</label>
        <input
          required
          type="text"
          name="number"
          className="form-input"
          maxLength={19}
          placeholder="0000 0000 0000 0000"
          value={formData.number}
          onChange={handleInputChange}
        />
        {/* Bonus: Logo de Franquicia */}
        <span className="card-icon">{getCardType(formData.number)}</span>
      </div>

      <div className="form-group">
        <label className="form-label">Titular</label>
        <input
          required
          type="text"
          name="name"
          className="form-input"
          placeholder="COMO APARECE EN LA TARJETA"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Fecha (MM/YY)</label>
          <input
            required
            type="text"
            name="expiry"
            className="form-input"
            placeholder="12/28"
            maxLength={5}
            value={formData.expiry}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label">CVC</label>
          <input
            required
            type="text"
            name="cvc"
            className="form-input"
            placeholder="123"
            maxLength={4}
            value={formData.cvc}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Validando..." : "Continuar al Resumen"}
      </button>
    </form>
  );
};
