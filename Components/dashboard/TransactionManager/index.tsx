"use client";

import { useState } from "react";
import AddTransaction from "../addTransaction";

export default function TransactionManager() {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <>
      <button
        onClick={() => setToggleMenu(true)}
        className="fixed bottom-20 left-5 rounded-full w-12 h-12 flex items-center justify-center bg-amber-400 px-4 py-2 text-white text-2xl"
      >
        +
      </button>

      <AddTransaction
        onShow={toggleMenu}
        onClose={() => setToggleMenu(false)}
      />
    </>
  );
}
