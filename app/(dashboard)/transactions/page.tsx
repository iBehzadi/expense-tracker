import TransactionManager from "@/Components/dashboard/TransactionManager";
import { getCurrentUserId } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
const formatToman = (amount: bigint) =>
  new Intl.NumberFormat("fa-IR").format(amount);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export default async function transactions() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("کاربر شناسایی نشد");
  }

  const account = await prisma.account.findFirst({
    where: { userId },
  });

  const [recent, income, expense] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
      include: {
        category: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        category: { type: "income" },
      },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        category: { type: "expense" },
      },
      _sum: { amount: true },
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
        {recent.length > 0 ? (
          <ul className="divide-y divide-gray-100 dark:divide-slate-800">
            {recent.map((transaction) => {
              const isIncome = transaction.category?.type === "income";

              return (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                        isIncome
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10"
                          : "bg-rose-100 text-rose-600 dark:bg-rose-500/10"
                      }`}
                    >
                      {isIncome ? <GoArrowUpRight /> : <GoArrowDownLeft />}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {transaction.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {transaction.category?.name ?? "بدون دسته‌بندی"}
                        {" · "}
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-bold ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {formatToman(transaction.amount)}
                    {isIncome ? "+" : "-"}
                    <span className="mr-1 text-xs font-normal">تومان</span>
                  </p>
                </li>
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
      <TransactionManager />
    </div>
  );
}
