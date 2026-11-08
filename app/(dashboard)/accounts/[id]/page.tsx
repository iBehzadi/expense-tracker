import TransactionItem from "@/Components/dashboard/transactions/TransactionItem";
import { getCurrentUserId } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatToman } from "@/utils/format";
import { notFound, redirect } from "next/navigation";
import { IoCardOutline, IoWalletOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlineSavings } from "react-icons/md";
import Link from "next/link";
import AccountManager from "@/Components/dashboard/accounts/AccountManager";

type Props = {
  params: Promise<{ id: string }>;
};
const accountTypes = {
  BANK: { label: "حساب بانکی", icon: <IoCardOutline /> },
  CASH: { label: "پول نقد", icon: <BsCashCoin /> },
  SAVINGS: { label: "پس‌انداز", icon: <MdOutlineSavings /> },
  OTHER: { label: "سایر", icon: <IoWalletOutline /> },
};

const colorClasses = {
  BANK: "bg-blue-500",
  CASH: "bg-red-500",
  SAVINGS: "bg-emerald-500",
  OTHER: "bg-amber-500",
};

export default async function accountDetails({ params }: Props) {
  const userId = await getCurrentUserId();
  if (userId === null) {
    redirect("/login");
  }
  const { id } = await params;
  const accountId = Number(id);

  if (!Number.isSafeInteger(accountId) || accountId <= 0) {
    notFound();
  }

  const [account, transactions, cat, acc] = await Promise.all([
    prisma.account.findFirst({
      where: { userId, id: accountId },
    }),

    prisma.transaction.findMany({
      where: {
        userId,
        accountId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
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

  if (!account) {
    notFound();
  }

  const incomes = transactions.filter(
    (item) => item.category.type === "income",
  );

  const expenses = transactions.filter(
    (item) => item.category.type === "expense",
  );
  const totalIncome = incomes.reduce(
    (sum, item) => sum + item.amount,
    BigInt(0),
  );

  const totalExpense = expenses.reduce(
    (sum, item) => sum + item.amount,
    BigInt(0),
  );
  const balance = account.initialBalance + totalIncome - totalExpense;

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-8">
        {/* جزییات حساب */}
        <div>
          {/* جزییات حساب */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
            {/* اطلاعات حساب */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${
                    colorClasses[account.type]
                  }`}
                >
                  {accountTypes[account.type].icon}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {account.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {accountTypes[account.type].label}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  account.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {account.isActive ? "حساب فعال" : "حساب غیرفعال"}
              </span>
            </div>

            {/* موجودی فعلی */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                موجودی فعلی
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                {formatToman(balance)}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                موجودی اولیه + درآمدها − هزینه‌ها
              </p>
            </div>

            {/* آمار درآمد و هزینه */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-100 p-3 dark:border-slate-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  مجموع درآمد
                </p>

                <p className="mt-2 font-bold text-green-600 dark:text-green-400">
                  {formatToman(totalIncome)}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3 dark:border-slate-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  مجموع هزینه
                </p>

                <p className="mt-2 font-bold text-red-600 dark:text-red-400">
                  {formatToman(totalExpense)}
                </p>
              </div>
            </div>

            {/* دکمه ویرایش */}
            <div className="mt-5 flex gap-3">
              <AccountManager
                account={{
                  id: account.id,
                  initialBalance: String(account.initialBalance),
                  name: account.name,
                  type: account.type,
                }}
                classes="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-200 dark:hover:bg-slate-800"
              />
            </div>

            {/* اطلاعات تکمیلی */}
            <div className="mt-5 border-t border-gray-100 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  موجودی اولیه
                </span>

                <span className="font-medium text-gray-800 dark:text-white">
                  {formatToman(account.initialBalance)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  تاریخ ایجاد حساب
                </span>

                <span className="font-medium text-gray-800 dark:text-white">
                  {formatDate(account.createdAt)}
                </span>
              </div>
            </div>
          </section>
        </div>
        {/* تراکنش های حساب */}
        <section className="overflow-hidden mb-18 rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {transactions.length > 0 ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-800">
                <div>
                  <h2 className="font-bold">تراکنش‌های حساب</h2>
                </div>

                <Link
                  href="/transactions"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  مشاهده همه
                </Link>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                {transactions.map((transaction) => {
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
            </>
          ) : (
            // در صورت نبود تراکنش
            <div className="p-10 text-center">
              <p className="font-medium">هنوز تراکنشی ثبت نکردی</p>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                بعد از ثبت اولین تراکنش، اطلاعات اینجا نمایش داده می‌شه.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
