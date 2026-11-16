
"use client";

import { useState } from "react";
import {
  FiPlus,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiShoppingBag,
  FiHome,
  FiTruck,
  FiHeart,
  FiCoffee,
  FiMoreHorizontal,
} from "react-icons/fi";
import { TfiWallet } from "react-icons/tfi";
type BudgetItem = {
  id: number;
  categoryName: string;
  limit: string;
  spent: string;
  icon: React.ReactNode;
};

const initialBudgets: BudgetItem[] = [
  {
    id: 1,
    categoryName: "خوراک",
    limit: "5000000",
    spent: "4000000",
    icon: <FiShoppingBag />,
  },
  {
    id: 2,
    categoryName: "حمل‌ونقل",
    limit: "3000000",
    spent: "2000000",
    icon: <FiTruck />,
  },
  {
    id: 3,
    categoryName: "مسکن",
    limit: "7000000",
    spent: "5000000",
    icon: <FiHome />,
  },
  {
    id: 4,
    categoryName: "سلامت",
    limit: "2000000",
    spent: "500000",
    icon: <FiHeart />,
  },
  {
    id: 5,
    categoryName: "تفریح",
    limit: "3000000",
    spent: "1000000",
    icon: <FiCoffee />,
  },
];

const formatToman = (value: bigint) =>
  new Intl.NumberFormat("fa-IR").format(value);

export default function BudgetsContent() {
  const [budgets] = useState(initialBudgets);
  const [selectedMonth, setSelectedMonth] = useState("2026-11");

  const totalLimit = budgets.reduce(
    (sum, item) => sum + BigInt(item.limit),
    BigInt(0)
  );

  const totalSpent = budgets.reduce(
    (sum, item) => sum + BigInt(item.spent),
    BigInt(0)
  );

  const remaining = totalLimit - totalSpent;

  const percentage =
    totalLimit > BigInt(0)
      ? Number((totalSpent * BigInt(100)) / totalLimit)
      : 0;

  return (
    <div dir="rtl" className="space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            بودجه‌بندی
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            مدیریت و کنترل هزینه‌های ماهانه
          </p>
        </div>

        <button
          onClick={() => alert("در مرحله بعد مودال بودجه را می‌سازیم")}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-sm transition"
        >
          <FiPlus size={18} />
          ایجاد بودجه
        </button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-3 bg-[#1E273C] border border-[#2A3548] rounded-xl px-4 py-3 w-fit">
        <FiCalendar className="text-gray-400" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-transparent text-white outline-none text-sm"
        >
          <option value="2026-11" className="bg-[#1E273C]">
            آبان ۱۴۰۵
          </option>
          <option value="2026-10" className="bg-[#1E273C]">
            مهر ۱۴۰۵
          </option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <SummaryCard
          title="کل بودجه"
          amount={totalLimit}
          icon={<TfiWallet />}
          color="text-blue-400"
        />

        <SummaryCard
          title="هزینه مصرف‌شده"
          amount={totalSpent}
          icon={<FiShoppingBag />}
          color="text-red-400"
        />

        <SummaryCard
          title="بودجه باقی‌مانده"
          amount={remaining}
          icon={<TfiWallet />}
          color="text-emerald-400"
        />

        <div className="bg-[#1E273C] border border-[#2A3548] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              درصد مصرف بودجه
            </span>
            <span className="text-purple-400 text-xl">
              %
            </span>
          </div>

          <div className="text-2xl font-bold text-white mt-5">
            {percentage.toLocaleString("fa-IR")}٪
          </div>

          <div className="w-full h-2 bg-[#0B1120] rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-[#1E273C] border border-[#2A3548] rounded-2xl overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-[#2A3548]">
          <div>
            <h2 className="text-white font-semibold">
              بودجه دسته‌بندی‌ها
            </h2>
            <p className="text-xs text-gray-400 mt-2">
              میزان مصرف بودجه در هر دسته
            </p>
          </div>

          <span className="text-xs text-gray-400">
            {budgets.length.toLocaleString("fa-IR")} دسته
          </span>
        </div>

        <div className="divide-y divide-[#2A3548]">
          {budgets.map((item) => {
            const limit = BigInt(item.limit);
            const spent = BigInt(item.spent);
            const left = limit - spent;

            const percent =
              limit > BigInt(0)
                ? Number((spent * BigInt(100)) / limit)
                : 0;

            const isWarning = percent >= 80;
            const isOver = spent > limit;

            return (
              <div
                key={item.id}
                className="p-5 hover:bg-[#252F45] transition"
              >
                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#0B1120] text-blue-400 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-white text-sm font-medium">
                        {item.categoryName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        سقف بودجه: {formatToman(limit)} تومان
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs ${
                        isOver
                          ? "text-red-400"
                          : isWarning
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {percent.toLocaleString("fa-IR")}٪
                    </span>

                    <button className="text-gray-400 hover:text-white">
                      <FiEdit2 />
                    </button>

                    <button className="text-gray-400 hover:text-red-400">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">
                      مصرف‌شده: {formatToman(spent)} تومان
                    </span>

                    <span className="text-gray-400">
                      {isOver ? "بیشتر از سقف بودجه" : `باقی‌مانده: ${formatToman(left)} تومان`}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#0B1120] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver
                          ? "bg-red-500"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function SummaryCard({
  title,
  amount,
  icon,
  color,
}: {
  title: string;
  amount: bigint;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-[#1E273C] border border-[#2A3548] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        <span className={`${color} text-xl`}>{icon}</span>
      </div>

      <div className="text-xl font-bold text-white mt-5">
        {formatToman(amount)}
      </div>

      <span className="text-xs text-gray-500 mt-2 block">
        تومان
      </span>
    </div>
  );
}
