import { getCurrentUserId } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { formatToman } from "@/utils/format";
import { IoCardOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlineSavings } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { IoMdAddCircle } from "react-icons/io";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const colorClasses = {
  BANK: "bg-blue-400 hover:bg-blue-500 ",
  CASH: "bg-red-400 hover:bg-red-500",
  SAVINGS: "bg-green-400 hover:bg-green-500",
  OTHER: "bg-amber-400 hover:bg-amber-500",
};

export default async function accounts() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    throw new Error("کاربر شناسایی نشد");
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
      <ul
        key={acc.id}
        className="flex items-center justify-between p-4 gap-2 shadow-sm border border-gray-300 my-4 bg-white rounded mx-6 "
      >
        {/* آیکون و نام حساب */}
        <li
          className={`bg-blue-400 p-2 rounded text-white text-3xl ${colorClasses[acc.type]}`}
        >
          {acc.type === "BANK" ? (
            <IoCardOutline />
          ) : acc.type === "CASH" ? (
            <BsCashCoin />
          ) : acc.type === "SAVINGS" ? (
            <MdOutlineSavings />
          ) : (
            <GiWallet />
          )}
        </li>
        <li>{acc.name}</li>

        {/* موجودی حساب */}
        <li className="flex flex-col items-end flex-1">
          <span>{formatToman(balance)}</span>
          <span className="text-[12px]">تومان</span>
        </li>
      </ul>
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
    <div className="flex flex-col">
      {/* نمایش دارایی کل */}
      <div className="flex flex-col items-center py-4 bg-green-500 text-white shadow-sm">
        <h2 className="text-4xl font-bold">{formatToman(amount)}</h2>
        <h4 className="text-sm">دارایی کل شما</h4>
      </div>

      {/* حساب ها */}
      <div>{accountCards}</div>
      {/* باتن های ایجاد حساب و جیب به جیب */}
      <div className="flex items-center justify-center gap-10">
        <button
          type="button"
          className="text-6xl  px-6 py-2 border focus:bg-gray-300 border-violet-300 rounded text-violet-400 bg-violet-100 hover:text-violet-500 hover:bg-violet-200 flex flex-col items-center"
        >
          <FaMoneyBillTransfer />
          <span className="text-sm text-black/80">جیب به جیب</span>
        </button>
        <button
          type="button"
          className="text-6xl focus:bg-gray-300 border border-green-300 text-green-400 bg-green-100 px-6 py-2 rounded hover:text-green-500 hover:bg-green-200 flex flex-col items-center"
        >
          <IoMdAddCircle />
          <span className="text-sm text-black/80">افزودن حساب</span>
        </button>
      </div>
    </div>
  );
}
