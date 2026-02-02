// src/services/wompi.service.ts
import axios from "axios";

const WOMPI_PUB_KEY = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2IUV8t3s4mOt7"; // Tu llave pública
const WOMPI_SANDBOX_URL = "https://api-sandbox.co.uat.wompi.dev/v1";

export const tokenizeCard = async (cardData: {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}) => {
  try {
    const response = await axios.post(
      `${WOMPI_SANDBOX_URL}/tokens/cards`,
      {
        number: cardData.number,
        cvc: cardData.cvc,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        card_holder: cardData.cardHolder,
      },
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PUB_KEY}`,
        },
      },
    );

    // Retornamos el ID del token (ej: "tok_test_123...")
    return response.data.data.id;
  } catch (error: any) {
    console.log("🔥 ERROR WOMPI DETALLADO:", error.response?.data);
    console.warn("⚠️ Tokenización falló. Usando Token Simulado.");

    // Retornamos un token falso que tu backend recibirá
    return `tok_test_mock_${Date.now()}`;
  }
};
