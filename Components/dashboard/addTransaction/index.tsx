"use client";

import DefButton from "@/Components/ui/button";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
type TransactionType = "expense" | "income";

type AddTransactionProps = {
  onShow?: boolean;
  onClose: () => void;
};
export default function AddTransaction({
  onShow,
  onClose,
}: AddTransactionProps) {
  const [type, setType] = useState<TransactionType>("expense");

  const handleType = (t: TransactionType) => {
    setType(t);
  };
  //   const wallet = (val, name) => (
  //     <select>
  //       <option value={val}>{name}</option>
  //     </select>
  //   );

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
              }`}
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
            placeholder="0"
            inputMode="numeric"
            className="bg-gray-50 py-2 px-4 rounded outline-0"
            name=""
            id=""
          />
        </div>

        <div className="flex flex-col w-full  gap-4 px-6 items-start ">
          <span>حساب: بانک ملت</span>
          <div>
            <label htmlFor="cat">دسته بندی :</label>
            <select name="cat" id="">
              <option value="">خوراک</option>
            </select>
          </div>
          <input type="date" name="" id="" />
          <label htmlFor="desc">توضیحات</label>
          <textarea
            name="desc"
            className="border border-gray-200 shadow w-full h-20 px-4 py-2 resize-none"
            placeholder="مثلا خرید پوشاک ..."
            id=""
          ></textarea>
        </div>
        <DefButton
          onBtnClick={() => {
            onClose;
          }}
          title="ثبت تراکنش"
          color="green"
          classes="w-[80%] py-3"
        />
      </form>
    </div>
  );
}
