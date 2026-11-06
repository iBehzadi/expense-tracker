"use client";

import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import AddAccountModal from "../AddAccountModal";

export default function AccountManager() {
  const [onShow, setOnShow] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOnShow(true)}
        className="text-6xl shadow-xl px-6 py-2 border border-green-300 rounded text-green-400 bg-green-100 hover:bg-green-200 flex flex-col items-center"
      >
        <IoMdAddCircle />
        <span className="text-sm text-black/80">افزودن حساب</span>
      </button>

      <AddAccountModal
        onShow={onShow}
        onClose={() => setOnShow(false)}
      />
    </>
  );
}