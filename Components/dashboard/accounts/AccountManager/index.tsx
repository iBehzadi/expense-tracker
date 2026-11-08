"use client";

import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import AccountModal from "../AccountModal";

type Account = {
  id: number;
  name: string;
  type: "BANK" | "CASH" | "SAVINGS" | "OTHER";
  initialBalance: string;
};

type AccountManagerProps = {
  account?: Account;
  classes?: string;
};

export default function AccountManager({
  account,
  classes
}: AccountManagerProps) {
  const [onShow, setOnShow] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOnShow(true)}
        className={classes}
      >
        {account ? <FiEdit2 /> : <IoMdAddCircle />}

        <span className={account ? "text-sm" : "text-sm text-black/80"}>
          {account ? "ویرایش حساب" : "افزودن حساب"}
        </span>
      </button>

      <AccountModal
        onShow={onShow}
        onClose={() => setOnShow(false)}
        account={account ?? null}
      />
    </>
  );
}