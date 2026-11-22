"use client";

import { useState } from "react";
import BudgetModal from "@/Components/dashboard/budgets/BudgetModal";
import { FiEdit2 } from "react-icons/fi";

export default function BudgetPage({
  categories,
  initialData,
}: {
  categories: { id: number; name: string;  }[];
  initialData?: {
    id: number;
    categoryId: number;
    limit: string | number;
    month: string;
  } | null;
}) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        {initialData ? (
          <FiEdit2 className="text-gray-400 hover:text-gray-600" />
        ) : (
          <span className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            ایجاد بودجه
          </span>
        )}
      </button>

      {showModal && (
        <BudgetModal
          categories={categories}
          onShow={showModal}
          onClose={() => setShowModal(false)}
          initialData={initialData}
        />
      )}
    </>
  );
}
