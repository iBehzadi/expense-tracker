
"use client";

import DefButton from "@/Components/ui/button";
import {
  createBudgetAction,
  deleteBudgetAction,
  updateBudgetAction,
} from "@/lib/actions/budgets";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { notify } from "@/utils/notify";
import { FaTrash } from "react-icons/fa6";

type Category = {
  id: number;
  name: string;
};

type BudgetInitialData = {
  id: number;
  categoryId: number;
  limit: string | number;
  month: string;
};

type BudgetModalProps = {
  onShow: boolean;
  onClose: () => void;
  categories: Category[];
  initialData?: BudgetInitialData | null;
};

export default function BudgetModal({
  onShow,
  onClose,
  categories,
  initialData,
}: BudgetModalProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [categoryId, setCategoryId] = useState(initialData ? String(initialData.categoryId) : "");
  const [limit, setLimit] = useState(initialData ? String(initialData.limit) : "");
  const [month, setMonth] = useState(initialData ? initialData.month : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError(null);

    const amount = Number(limit);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      notify("error", "سقف بودجه معتبر نیست");
      return;
    }

    setLoading(true);

    try {
      const result = isEdit
        ? await updateBudgetAction({
            budgetId: initialData.id,
            limit: amount,
          })
        : await createBudgetAction({
            categoryId: Number(categoryId),
            limit: amount,
            month,
          });

      if (!result.success) {
        setError(result.error ?? null);
        notify("error", result.error ?? "خطایی رخ داده است");
        return;
      }

      notify("success", result.message ?? "عملیات با موفقیت انجام شد");
      onClose();
      router.refresh();
    } catch {
      notify("error", "خطایی در ارتباط با سرور رخ داده است");
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async () => {
      const id = initialData?.id;
      if (!id) return;
  
      const confirmation = confirm("آیا از حذف این بودجه مطمئنی؟");
  
      if (confirmation) {
        const result = await deleteBudgetAction(id);
        if (!result.success) {
          setError(result.message ?? null);
          notify("error", error ?? "خطایی رخ داده است.");
          return;
        }
        notify("success", result.message ?? "عملیات با موفقیت انجام شد");
      } else {
        return;
      }
  
      router.refresh();
      onClose();
    };
  return (
    <div
      className={`fixed inset-0 z-60 flex items-end justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300 ${
        onShow
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={`mb-10 flex h-auto max-h-[90dvh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900 ${
          onShow ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="relative flex shrink-0 flex-col items-center gap-4 bg-blue-600 px-6 py-5 text-white">
          <div className="h-1.5 w-12 rounded-full bg-white/50" />

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute left-5 top-5 rounded-full p-1 transition hover:bg-white/20"
          >
            <IoCloseCircle size={26} />
          </button>

          <div className="text-center">
            <h2 className="text-lg font-bold">
              {isEdit ? "ویرایش بودجه" : "ایجاد بودجه جدید"}
            </h2>
            <p className="mt-1 text-sm text-white/80">
              {isEdit
                ? "سقف بودجه خود را تغییر دهید"
                : "برای هزینه‌های ماهانه خود محدودیت تعیین کنید"}
            </p>
          </div>

          {/* Amount */}
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-sm text-white/80">سقف بودجه</span>

            <div className="flex w-full max-w-xs items-center gap-3 rounded-2xl bg-white/15 px-4 py-3">
              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="۰"
                disabled={loading}
                className="w-full bg-transparent text-center text-3xl font-bold text-white outline-none placeholder:text-white/50"
              />

              <span className="shrink-0 text-sm text-white/80">تومان</span>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="budget-category"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              دسته‌بندی هزینه
            </label>

            <select
              id="budget-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading || isEdit}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {!isEdit && categories.length === 0 && (
              <p className="text-xs text-red-500">
                ابتدا یک دسته‌بندی هزینه ایجاد کنید.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="budget-month"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              ماه بودجه
            </label>

            <input
              id="budget-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={loading || isEdit}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-blue-500 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-500 dark:bg-red-500/10">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mb-12 flex shrink-0 items-center gap-4 border-t border-gray-100 px-5 pt-4 dark:border-slate-800">
          <DefButton
            disabled={
              loading ||
              !limit ||
              (!isEdit && (!categoryId || categories.length === 0))
            }
            title={
              loading
                ? "در حال ثبت..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ایجاد بودجه"
            }
            color="green"
            type="submit"
            classes="w-full py-3.5 rounded-xl"
          />

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || !isEdit}
            className={`rounded-xl bg-rose-50 px-5 py-4 text-sm text-rose-600 transition hover:bg-rose-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 ${
              !isEdit ? "opacity-50 pointer-events-none hidden" : ""
            }`}
          >
           <FaTrash  /> 
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-gray-200 px-5 py-4 text-sm text-gray-700 transition hover:bg-gray-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
