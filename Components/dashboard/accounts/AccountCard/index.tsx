"use client";

import { useState } from "react";
import Link from "next/link";
import { formatToman } from "@/utils/format";

import { IoCardOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlineSavings } from "react-icons/md";
import { GiWallet } from "react-icons/gi";

type AccountCardProps = {
  account: {
    id: number;
    name: string;
    type: "BANK" | "CASH" | "SAVINGS" | "OTHER";
    initialBalance: string;
  };
  balance: string;
};

const colorClasses = {
  BANK: "bg-blue-400 hover:bg-blue-500",
  CASH: "bg-red-400 hover:bg-red-500",
  SAVINGS: "bg-green-400 hover:bg-green-500",
  OTHER: "bg-amber-400 hover:bg-amber-500",
};

export default function AccountCard({ account, balance }: AccountCardProps) {

  const accountIcon = {
    BANK: <IoCardOutline />,
    CASH: <BsCashCoin />,
    SAVINGS: <MdOutlineSavings />,
    OTHER: <GiWallet />,
  };

  return (
    <>
      <Link
        href={`/accounts/${account.id}`}
        className="flex items-center justify-between p-3 gap-2 shadow-xl border border-gray-300 my-4 bg-white rounded mx-6 "
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded p-2 text-3xl text-white ${colorClasses[account.type]}`}
          >
            {accountIcon[account.type]}
          </span>
          <span className="truncate">{account.name}</span>
        </div>

        <div className="flex flex-col items-end">
          <span>{formatToman(BigInt(balance))}</span>
          <span className="text-[12px]">تومان</span>
        </div>
      </Link>

      
    </>
  );
}
