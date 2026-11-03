export type Transaction = {
  id: number;
  title: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type SetTransaction = {
  title: string;
  amount: string;
  type: "income" | "expense";
  accountId: number;
  categoryId: number;
  description?: string | null;
  date?: string;
};

export type UpdateTransaction = {
  id: number;
  transaction: Partial<Omit<SetTransaction, "type">> & {
    type?: "income" | "expense";
  };
};
//get transactoins
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "خطا در دریافت تراکنش‌ها");
  }
  return data;
}
//post new transaction
export async function setTransaction(transaction: SetTransaction) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "خطا در ثبت تراکنش");
  }

  return data;
}

//update transaction
export async function updateTransaction({
  id,
  transaction,
}: UpdateTransaction) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "خطا در تغییر تراکنش");
  }

  return data;
}
//delete transaction
export async function deleteTransaction(id: number) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "خطا در حذف تراکنش");
  }

  return data;
}