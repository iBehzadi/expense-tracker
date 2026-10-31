import { prisma } from "../../lib/prisma";
import { getCurrentUserId } from "@/lib/api/auth";
import Link from "next/link";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { GoArrowUpRight,GoArrowDownLeft } from "react-icons/go";

const formatToman = (amount: bigint) =>
  new Intl.NumberFormat("fa-IR").format(amount);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export default async function DashboardPage() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("کاربر شناسایی نشد");
  }

  const account = await prisma.account.findFirst({
    where: { userId },
  });

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

  // محدوده تاریخ ماه جاری
  const now = new Date();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

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
        date: {
          gte: monthStart,
          lt: nextMonth,
        },
        category: { type: "income" },
      },
      _sum: { amount: true },
    }),

    prisma.transaction.aggregate({
      where: {
        userId,
        date: {
          gte: monthStart,
          lt: nextMonth,
        },
        category: { type: "expense" },
      },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = income._sum.amount ?? BigInt(0);
  const totalExpense = expense._sum.amount ?? BigInt(0);
  const balance = totalIncome - totalExpense;

  const currentMonth = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentMonth}
        </span>
      </header>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {/* Income */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              درآمد این ماه
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-600 dark:bg-emerald-500/10">
              <FaArrowAltCircleUp />
            </span>
          </div>

          <p className="text-2xl font-bold text-emerald-600">
            {formatToman(totalIncome)}
            <span className="mr-2 text-sm font-normal">تومان</span>
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              هزینه این ماه
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-xl text-rose-600 dark:bg-rose-500/10">
              <FaArrowAltCircleDown />
            </span>
          </div>

          <p className="text-2xl font-bold text-rose-600">
            {formatToman(totalExpense)}
            <span className="mr-2 text-sm font-normal">تومان</span>
          </p>
        </div>

        {/* Balance */}
        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              مانده خالص این ماه
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600 dark:bg-blue-500/10">
              =
            </span>
          </div>

          <p
            className={`text-2xl font-bold ${
              balance >= BigInt(0) ? "text-blue-600" : "text-rose-600"
            }`}
          >
            {formatToman(balance < BigInt(0) ? -balance : balance)}
            <span className="mr-2 text-sm font-normal">تومان</span>
          </p>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="overflow-hidden mb-18 rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-bold">تراکنش‌های اخیر</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              آخرین ۵ تراکنش ثبت‌شده
            </p>
          </div>

          <Link
            href="/transactions"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            مشاهده همه
          </Link>
        </div>

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
                      {isIncome ? <GoArrowUpRight/> : <GoArrowDownLeft />}
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
    </main>
  );
}
