"use client";

import DefButton from "@/Components/ui/button";
import { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

type TransactionType = "expense" | "income";
type Category = {
  id: number;
  name: string;
  type: "income" | "expense";
};
type account = {
  id: number;
  name: string;
  type: string;
};
type TransactionFormProps = {
  onShow?: boolean;
  onClose: () => void;
  transaction?: {
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
  categories: Category[];
  accounts: account[];
};
export default function TransactionForm({
  onShow,
  onClose,
  transaction,
  categories,
  accounts,
}: TransactionFormProps) {
  const [title, setTitle] = useState(transaction?.title);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState(
    transaction?.categoryId.toString() || "",
  );
  const [accountId, setAccountId] = useState(
    transaction?.accountId.toString() || "",
  );

  useEffect(() => {
    if (transaction) {
      setType(transaction.category.type);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description ?? "");

      const d = new Date(transaction.date);
      const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

      setDate(localDate.toISOString().slice(0, 10));
    } else {
      setType("expense");
      setAmount("");
      setDescription("");
      setDate(new Date().toLocaleDateString("en-US"));
    }
  }, [transaction, onShow]);

  const handleType = (t: TransactionType) => {
    setType(t);
    setCategoryId("");
  };

  const handleSubmit = () => {
    const payload = {
      //     id:
      // title:
      // amount:
      // type
      // accountId:
      // categoryId:
      // description:
      // date:
    };
  };

  return (
  <div
    className={`fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${
      onShow
        ? "visible opacity-100"
        : "invisible pointer-events-none opacity-0"
    }`}
    onClick={onClose}
  >
    <form
      onClick={(e) => e.stopPropagation()}
      className={`mb-10 flex h-auto max-h-[90dvh]   w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900 ${
        onShow ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Header */}
      <div
        className={`relative flex shrink-0 flex-col items-center gap-4 px-6 py-5 text-white ${
          type === "expense" ? "bg-red-500" : "bg-emerald-500"
        }`}
      >
        <div className="h-1.5 w-12 rounded-full bg-white/50" />

        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 rounded-full p-1 transition hover:bg-white/20"
        >
          <IoCloseCircle size={26} />
        </button>

        <div className="flex overflow-hidden rounded-xl bg-black/10 p-1">
          <button
            type="button"
            onClick={() => handleType("expense")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              type === "expense"
                ? "bg-white text-red-500 shadow"
                : "text-white"
            }`}
          >
            هزینه
          </button>

          <button
            type="button"
            onClick={() => handleType("income")}
            className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
              type === "income"
                ? "bg-white text-emerald-600 shadow"
                : "text-white"
            }`}
          >
            درآمد
          </button>
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <span className="text-sm text-white/80">مبلغ تراکنش</span>

          <div className="flex w-full max-w-xs items-center gap-3 rounded-2xl bg-white/15 px-4 py-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="۰"
              className="w-full bg-transparent text-center text-3xl font-bold text-white outline-none placeholder:text-white/50"
            />
            <span className="shrink-0 text-sm text-white/80">تومان</span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex min-w-0 flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              عنوان
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً خرید ..."
              className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Account */}
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="acc"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              حساب
            </label>
            <select
              id="acc"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">انتخاب حساب</option>
              {accounts?.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="cat"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              دسته‌بندی
            </label>
            <select
              id="cat"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories
                ?.filter((cat) => cat.type === type)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="transaction-date"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              تاریخ
            </label>
            <input
              id="transaction-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="desc"
            className="text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            توضیحات
            <span className="mr-1 font-normal text-gray-400">(اختیاری)</span>
          </label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثلاً خرید مواد غذایی..."
            className="h-12 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t mb-12 border-gray-100 px-5 dark:border-slate-800">
        <DefButton
          onBtnClick={onClose}
          title={transaction ? "ذخیره تغییرات" : "ثبت تراکنش"}
          color="green"
          classes="w-full py-3.5 rounded-xl"
        />
      </div>
    </form>
  </div>
);
}
