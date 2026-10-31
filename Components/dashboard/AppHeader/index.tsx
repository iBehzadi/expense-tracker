"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BiWallet,BiUserCircle } from "react-icons/bi";

interface User {
  id: number;
  name: string | null;
  email: string;
}

export default function AppHeader() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات کاربر");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }

    getUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div
        dir="rtl"
        className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-y-3 px-4 py-3 lg:flex lg:h-20 lg:justify-between lg:gap-6 lg:py-0"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 lg:order-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <BiWallet size={25} />
          </div>

          <div>
            <h1 className="text-base font-extrabold text-gray-900 dark:text-white">
              مدیریت هزینه
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Personal Finance
            </p>
          </div>
        </Link>

        {/* User */}
        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-xl border border-gray-200 p-2 transition hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800 lg:order-3"
        >
          <div className="flex h-9 w-9 items-center justify-center text-2xl rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <BiUserCircle  />
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
             {user?.name}
            </p>
            <p className="mt-1 text-[10px] text-gray-500">تنظیمات حساب</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
