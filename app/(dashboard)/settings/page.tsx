"use client";

import { useEffect, useState } from "react";
import LogoutButton from "@/Components/ui/logOutButton";

interface User {
  id: number;
  name: string | null;
  email: string;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

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
        setName(data.user.name ?? "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(data.user);
      alert("اطلاعات با موفقیت ذخیره شد");
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در ذخیره اطلاعات");
    }
  }

  if (loading) {
    return <p className="p-6 text-gray-500">در حال دریافت اطلاعات...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تنظیمات حساب کاربری
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          اطلاعات شخصی حساب خود را مدیریت کنید.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            {name.charAt(0) || "U"}
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {user?.name || "کاربر"}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form
          onSubmit={handleUpdateProfile}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">
              نام و نام خانوادگی
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">
              ایمیل
            </label>

            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            ذخیره تغییرات
          </button>
        </form>
      </section>

      {/* Logout */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold text-red-600 dark:text-red-400">
            خروج از حساب کاربری
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            از حساب کاربری خود خارج شوید.
          </p>
        </div>

        <LogoutButton />
      </section>
    </div>
  );
}
