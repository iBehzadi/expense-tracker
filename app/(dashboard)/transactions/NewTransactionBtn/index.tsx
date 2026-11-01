"use client";

import { useState } from "react";
import TransactionForm from "../TransactionForm";
type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
};

type NewTransactionBtnProps = {
  categories: Category[];
};
export default function NewTransactionBtn({
  categories,
}: NewTransactionBtnProps) {
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
        categories={categories}
      />
    </>
  );
}
