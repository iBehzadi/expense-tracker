"use client";

import { useState } from "react";
import TransactionForm from "../TransactionForm";

export default function NewTransactionBtn() {
  const [toggleForm, setToggleForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setToggleForm(true)}
        className="fixed bottom-20 left-5 rounded-full w-12 h-12 flex items-center justify-center bg-amber-400 px-4 py-2 text-white text-2xl"
      >
        +
      </button>

      <TransactionForm
        onShow={toggleForm}
        onClose={() => setToggleForm(false)}
      />
    </>
  );
}
