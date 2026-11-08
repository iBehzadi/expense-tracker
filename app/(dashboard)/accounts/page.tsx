import { getCurrentUserId } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { formatToman } from "@/utils/format";
import { IoCardOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlineSavings } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { redirect } from "next/navigation";
import AccountManager from "@/Components/dashboard/accounts/AccountManager";
import Link from "next/link";
import AccountCard from "@/Components/dashboard/accounts/AccountCard";

const colorClasses = {
  BANK: "bg-blue-400 hover:bg-blue-500 ",
  CASH: "bg-red-400 hover:bg-red-500",
  SAVINGS: "bg-green-400 hover:bg-green-500",
  OTHER: "bg-amber-400 hover:bg-amber-500",
};

export default async function accounts() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    redirect("/login");
  }

  //اتصال به دیتابیس و دریافت حساب ها و تراکنش ها
  const [allAccounts, incomes, expenses] = await Promise.all([
    prisma.account.findMany({
      where: { userId },
    }),

    prisma.transaction.findMany({
      where: {
        userId,
        category: { type: "income" },
      },
      select: {
        accountId: true,
        amount: true,
      },
    }),

    prisma.transaction.findMany({
      where: {
        userId,
        category: { type: "expense" },
      },
      select: {
        accountId: true,
        amount: true,
      },
    }),
  ]);

  let amount = BigInt(0);

  const incomeMap = new Map<number, bigint>();
  for (const item of incomes) {
    const current = incomeMap.get(item.accountId) ?? BigInt(0);
    incomeMap.set(item.accountId, current + item.amount);
  }

  const expenseMap = new Map<number, bigint>();
  for (const item of expenses) {
    const current = expenseMap.get(item.accountId) ?? BigInt(0);
    expenseMap.set(item.accountId, current + item.amount);
  }

  // تابع نمایش حساب ها
  const accountCards = allAccounts.map((acc) => {
    const income = incomeMap.get(acc.id) ?? BigInt(0);
    const expense = expenseMap.get(acc.id) ?? BigInt(0);

    const balance = acc.initialBalance + income - expense;

    amount += balance;

    return (
      <AccountCard
        key={acc.id}
        account={{
          id: acc.id,
          name: acc.name,
          type: acc.type,
          initialBalance: acc.initialBalance.toString(),
        }}
        balance={balance.toString()}
      />
    );
  });

  // اگر کاربر هنوز حسابی ایجاد نکرده باشد
  if (allAccounts.length === 0) {
    return (
      <main className="mx-auto max-w-7xl p-4 py-10 md:p-8">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 text-4xl">💳</div>

          <h1 className="mb-2 text-xl font-bold">هنوز حسابی ایجاد نکردی!</h1>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            برای شروع مدیریت درآمد و هزینه‌ها، ابتدا حساب مالی خودت رو ایجاد کن.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col mb-14">
      {/* دارایی کل - ثابت */}
      <div className="shrink-0 gap-2 flex flex-col items-center py-4 mt-4 mx-3 rounded-2xl bg-green-500 text-white shadow-xl">
        <h4 className="text-sm">دارایی کل شما</h4>
        <h2 className="text-4xl font-bold">{formatToman(amount)}</h2>
      </div>

      {/* حساب ها */}
      <div className="flex-1  ">
        <div>{accountCards}</div>

        {/* دکمه ها */}
        <div className="flex items-center justify-center gap-10 mt-2 pb-4">
          {/* جیب به حیب */}
          <button
            type="button"
            disabled
            className="text-6xl shadow-xl px-6 py-2 border focus:bg-gray-300 border-violet-300 rounded text-violet-400 bg-violet-100 hover:text-violet-500 hover:bg-violet-200 flex flex-col items-center"
          >
            <FaMoneyBillTransfer />
            <span className="text-sm text-black/80">جیب به جیب</span>
          </button>

          {/* افزودن حساب */}
          <AccountManager classes="flex flex-col items-center rounded border border-green-300 bg-green-100 px-6 py-2 text-6xl text-green-400 shadow-xl hover:bg-green-200" />
        </div>
      </div>
    </div>
  );
}
