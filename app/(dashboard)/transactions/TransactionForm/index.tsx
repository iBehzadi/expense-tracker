"use client";

import DefButton from "@/Components/ui/button";
import { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
type TransactionType = "expense" | "income";

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
};
export default function TransactionForm({
  onShow,
  onClose,
  transaction,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

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
  };
  const selectOpt = (val: string | undefined, name: string | undefined) => (
    <select>
      <option value={val}>{name}</option>
    </select>
  );

  return (
    <div
      className={`fixed inset-0 z-60 bg-black/30 flex items-end justify-center transition-transform duration-300 ${
        onShow
          ? "translate-y-0"
          : "translate-y-full invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center rounded-2xl overflow-hidden h-[80%] bg-white w-full gap-4 "
      >
        <div
          className={`relative flex flex-col w-full transition-all duration-300 py-6 ${type === "expense" ? "bg-red-500" : "bg-green-500"} justify-center items-center  gap-6`}
        >
          <span onClick={onClose} className="absolute left-3 top-3 text-2xl">
            <IoCloseCircle color="white" />
          </span>

          <div className="flex  rounded overflow-hidden">
            <button
              type="button"
              onClick={() => handleType("expense")}
              className={` px-4 py-1 transition-all duration-300 ${
                type === "expense"
                  ? "bg-white text-black"
                  : "bg-black/10 text-white"
              } `}
            >
              هزینه
            </button>

            <button
              type="button"
              onClick={() => handleType("income")}
              className={` px-4 py-1 transition-all duration-300 ${
                type === "income"
                  ? "bg-white text-black"
                  : "bg-black/10 text-white"
              }`}
            >
              درآمد
            </button>
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="bg-gray-50 py-2 px-4 rounded outline-0"
          />
        </div>

        <div className="flex flex-col w-full  gap-4 px-6 items-start ">
          <div>
            <label htmlFor="cat">دسته بندی :</label>
            {selectOpt(transaction?.category.type, transaction?.category.name)}
          </div>
          <label htmlFor="">
            تاریخ :‌
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label htmlFor="desc">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <DefButton
          onBtnClick={onClose}
          title={transaction ? "ویرایش تراکنش" : "ثبت تراکنش"}
          color="green"
          classes="w-[80%] py-3"
        />
      </form>
    </div>
  );
}
