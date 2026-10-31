"use client";
import React, { useState } from "react";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import TransactionForm from "../TransactionForm";
type TransactionItemProps = {
  isIncome: boolean;
  transaction: {
    category: {
      name: string;
      type: "income" | "expense";
    };
  } & {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    title: string;
    amount: bigint;
    description: string | null;
    date: Date;
    accountId: number;
    categoryId: number;
  };
};
const formatToman = (amount: bigint) =>
  new Intl.NumberFormat("fa-IR").format(amount);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

export default function TransactionItem({
  isIncome,
  transaction,
}: TransactionItemProps) {
  const [toggleForm, setToggleForm] = useState(false);
  return (
    <>
      <li
        onClick={() => setToggleForm(true)}
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
            <p className="truncate font-medium">{transaction.title}</p>

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
      <TransactionForm
        onShow={toggleForm}
        onClose={() => setToggleForm(false)}
      />
    </>
  );
}
