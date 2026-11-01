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

type setTransaction = {
  id: number;
  title: string;
  amount: string;
  type: "income" | "expense";
  accountId: number;
  categoryId: number;
  description: string;
  date: string;
};
//دریافت تراکنش ها
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");

  if (!response.ok) {
    throw new Error("خطا در دریافت تراکنش‌ها");
  }

  return response.json();
}

export async function setTransaction(transaction: setTransaction) {
  const response = await fetch("/api/transactions", {
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("خطا در انجام ...");
  }

  return response.json();
}
