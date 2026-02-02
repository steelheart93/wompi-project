// src/features/transaction/transactionSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
  step: "PRODUCT" | "FORM" | "SUMMARY" | "PROCESSING" | "RESULT";
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  } | null;
  deliveryData: {
    email: string;
    address: string;
  };
  cardToken: string | null; // El token que nos dará Wompi
  transactionResult: any | null; // La respuesta de TU backend
  error: string | null;
}

const initialState: TransactionState = {
  step: "PRODUCT",
  product: null,
  deliveryData: { email: "", address: "" },
  cardToken: null,
  transactionResult: null,
  error: null,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<any>) => {
      state.product = action.payload;
    },
    setDeliveryData: (
      state,
      action: PayloadAction<{ email: string; address: string }>,
    ) => {
      state.deliveryData = action.payload;
    },
    setCardToken: (state, action: PayloadAction<string>) => {
      state.cardToken = action.payload;
    },
    setStep: (state, action: PayloadAction<TransactionState["step"]>) => {
      state.step = action.payload;
    },
    setTransactionSuccess: (state, action: PayloadAction<any>) => {
      state.transactionResult = action.payload;
      state.step = "RESULT";
    },
    setTransactionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.step = "RESULT";
    },
    resetTransaction: (state) => {
      state.step = "PRODUCT";
      state.deliveryData = { email: "", address: "" };
      state.cardToken = null;
      state.transactionResult = null;
      state.error = null;
      // Nota: No borramos 'product' para que se actualice solo al volver
    },
  },
});

export const {
  setProduct,
  setDeliveryData,
  setCardToken,
  setStep,
  setTransactionSuccess,
  setTransactionError,
  resetTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
