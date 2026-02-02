// src/App.tsx
import { ProductPage } from "./pages/ProductPage";
import { useAppSelector } from "./app/hooks";
import { CreditCardForm } from "./components/CreditCardForm";
import { SummaryPage } from "./pages/SummaryPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
  const step = useAppSelector((state) => state.transaction.step);

  return (
    <div>
      {step === "PRODUCT" && <ProductPage />}
      {step === "FORM" && <CreditCardForm />}
      {step === "SUMMARY" && <SummaryPage />}
      {step === "RESULT" && <ResultPage />}
    </div>
  );
}

export default App;
