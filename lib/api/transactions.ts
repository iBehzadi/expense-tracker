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

//دریافت تراکنش ها
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");

  if (!response.ok) {
    throw new Error("خطا در دریافت تراکنش‌ها");
  }

  return response.json();
}

