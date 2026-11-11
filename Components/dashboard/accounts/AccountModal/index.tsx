"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DefButton from "@/Components/ui/button";
import { IoCloseCircle } from "react-icons/io5";
import { IoCardOutline, IoWalletOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlineSavings } from "react-icons/md";
import {
  createAccountAction,
  updateAccountAction,
} from "@/lib/actions/accounts";

type AccountType = "BANK" | "CASH" | "SAVINGS" | "OTHER";

type Account = {
  id: number;
  name: string;
  type: AccountType;
  initialBalance: string;
};

type AddAccountModalProps = {
  onShow: boolean;
  onClose: () => void;
  account?: Account | null;
};

const accountTypes = [
  { value: "BANK", label: "بانکی", icon: <IoCardOutline /> },
  { value: "CASH", label: "نقدی", icon: <BsCashCoin /> },
  { value: "SAVINGS", label: "پس‌انداز", icon: <MdOutlineSavings /> },
  { value: "OTHER", label: "سایر", icon: <IoWalletOutline /> },
] as const;

const colorClasses = {
  BANK: "bg-blue-500",
  CASH: "bg-red-500",
  SAVINGS: "bg-emerald-500",
  OTHER: "bg-amber-500",
};

export default function AccountModal({
  onShow,
  onClose,
  account = null,
}: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("BANK");
  const [initialBalance, setInitialBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (onShow) {
      setName(account?.name ?? "");
      setType(account?.type ?? "BANK");
      setInitialBalance(account?.initialBalance ?? "");
      setError("");
    }
  }, [onShow, account]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("نام حساب را وارد کن");
      return;
    }

    if (!/^\d+$/.test(initialBalance || "0")) {
      setError("موجودی اولیه معتبر نیست");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name,
        type,
        initialBalance,
      };

      const data = account
        ? await updateAccountAction(account.id, payload)
        : await createAccountAction(payload);

      if (!data.success) {
        throw new Error(data.message || "خطا در ذخیره حساب");
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت حساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-60 flex items-end justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 sm:items-center ${
        onShow
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`mb-10 flex h-auto max-h-[90dvh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900 sm:mb-0 ${
          onShow ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div
          className={`relative flex shrink-0 flex-col items-center gap-4 px-6 py-4 text-white transition-colors ${colorClasses[type]}`}
        >
          <div className="h-1.5 w-12 rounded-full bg-white/50" />

          <button
            type="button"
            onClick={onClose}
            className="absolute left-5 top-5 rounded-full p-1 transition hover:bg-white/20"
          >
            <IoCloseCircle size={26} />
          </button>

          <h2 className="text-lg font-bold">
            {account ? "ویرایش حساب" : "افزودن حساب"}
          </h2>

          <div className="flex items-center justify-center text-5xl">
            {accountTypes.find((item) => item.value === type)?.icon}
          </div>

          <span className="text-sm text-white/90">
            {accountTypes.find((item) => item.value === type)?.label}
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3 p-5">
          {/* Account name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              نام حساب
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً بانک ملت، کیف پول..."
              maxLength={100}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Account type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              نوع حساب
            </label>

            <div className="grid grid-cols-4 gap-2">
              {accountTypes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setType(item.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-2xl transition ${
                    type === item.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                      : "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Initial balance */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              موجودی اولیه
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-emerald-500 dark:border-slate-700 dark:bg-slate-800">
              <input
                type="number"
                min="0"
                step="1"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="۰"
                className="w-full bg-transparent text-lg font-bold outline-none dark:text-white"
              />
              <span className="shrink-0 text-sm text-gray-500">تومان</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="mb-12 flex items-center gap-3 border-t border-gray-100 px-5 pt-4 dark:border-slate-800">
          <DefButton
            title={account ? "ذخیره تغییرات" : "ثبت حساب"}
            type="submit"
            classes="rounded-xl bg-blue-200 w-full px-5 py-4 text-gray-700 hover:bg-blue-300 dark:bg-slate-700 dark:text-white"
          />

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-gray-200 px-5 py-4 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-white"
          >
            لغو
          </button>
        </div>
      </form>
    </div>
  );
}
