
import { prisma } from "../../lib/prisma";
import { getCurrentUserId } from "@/lib/api/auth";

export default async function DashboardPage() {
  const getUser = await getCurrentUserId();
  if (getUser === null) {
    throw new Error("کاربر شناسایی نشد");
  }
  const account = await prisma.account.findFirst({
    where: {
      userId: getUser,
    },
  });

  const transactions = await prisma.transaction.findMany({
  where: {
    userId: getUser,
  },
  orderBy: {
    date: "desc",
  },
  take: 5,
});


  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, BigInt(0));

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, BigInt(0));

  return (
    <>
      {account ? (
        <main className="p-4">
          <h1 className="mb-6 text-2xl font-bold">داشبورد مدیریت هزینه</h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section className="rounded-xl border p-4">
              <h2 className="mb-2 text-sm">درآمد ۵ تراکنش اخیر</h2>
              <p className="text-xl font-bold">
                {totalIncome.toString()} تومان
              </p>
            </section>

            <section className="rounded-xl border p-4">
              <h2 className="mb-2 text-sm">هزینه ۵ تراکنش اخیر</h2>
              <p className="text-xl font-bold">
                {totalExpense.toString()} تومان
              </p>
            </section>
          </div>

          <h2 className="mb-3 mt-8 text-lg font-bold">تراکنش‌های اخیر</h2>

          <ul className="space-y-3">
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.categoryId}
                  </p>
                </div>

                <p className="font-bold">
                  {transaction.amount.toString()} تومان
                </p>
              </li>
            ))}
          </ul>
        </main>
      ) : (
        <div>
          <button>ایجاد حساب</button>
        </div>
      )}
    </>
  );
}
