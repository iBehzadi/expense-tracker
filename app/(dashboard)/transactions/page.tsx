import NewTransactionBtn from "./NewTransactionBtn";
import { getCurrentUserId } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TransactionItem from "./TransactionItem";

export default async function transactions() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("کاربر شناسایی نشد");
  }

  const account = await prisma.account.findFirst({
    where: { userId },
  });

  const [result, cat, acc] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },

      include: {
        category: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    }),

    prisma.category.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    }),

    prisma.account.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    }),
  ]);

  // اگر کاربر هنوز حسابی ایجاد نکرده باشد
  if (!account) {
    return (
      <main className="mx-auto max-w-7xl p-4 py-10 md:p-8">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 text-4xl">💳</div>

          <h1 className="mb-2 text-xl font-bold">هنوز حسابی ایجاد نکردی!</h1>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            برای شروع مدیریت درآمد و هزینه‌ها، ابتدا حساب مالی خودت رو ایجاد کن.
          </p>

          <Link
            href="/accounts"
            className="inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            ایجاد حساب جدید
          </Link>
        </div>
      </main>
    );
  }
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-8">
      <section className="overflow-hidden mb-18 rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {result.length > 0 ? (
          <ul className="divide-y divide-gray-100 dark:divide-slate-800">
            {result.map((transaction) => {
              const isIncome = transaction.category?.type === "income";
              return (
                <TransactionItem
                  isIncome={isIncome}
                  key={transaction.id}
                  transaction={transaction}
                  categories={cat}
                  accounts={acc}
                />
              );
            })}
          </ul>
        ) : (
          <div className="p-10 text-center">
            <p className="font-medium">هنوز تراکنشی ثبت نکردی</p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              بعد از ثبت اولین تراکنش، اطلاعات اینجا نمایش داده می‌شه.
            </p>
          </div>
        )}
      </section>
      <NewTransactionBtn categories={cat} accounts={acc} />
    </div>
  );
}
