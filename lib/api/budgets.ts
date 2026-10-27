export type Budget = {
  id: number;
  category: string;
  limit: number;
  month: string;
};

//دریافت بودجه ها
export async function getBudgets(): Promise<Budget[]> {
  const response = await fetch("/api/budgets");

  if (!response.ok) {
    throw new Error("خطا در دریافت بودجه‌ها");
  }

  return response.json();
}
