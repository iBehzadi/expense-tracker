import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FiPlus,
  FiCalendar,
  FiShoppingBag,
  FiHome,
  FiTruck,
  FiHeart,
  FiCoffee,
  FiMoreHorizontal,
  FiTarget,
} from "react-icons/fi";
import BudgetManager from "@/Components/dashboard/budgets/BudgetManager";
import { formatToman } from "@/utils/format";
import { getCurrentUserId } from "@/lib/api/session";
import {
  getBudgetsService,
  getBudgetSpendingService,
} from "@/lib/services/budget.service";
import { getCategoriesService } from "@/lib/services/category.service";

const categoryIcons: Record<string, React.ReactNode> = {
  خوراک: <FiShoppingBag />,
  مسکن: <FiHome />,
  حمل‌ونقل: <FiTruck />,
  سلامت: <FiHeart />,
  تفریح: <FiCoffee />,
};

export default async function BudgetsPage() {
  // احراز هویت کاربر
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  // محاسبه بازه ماه جاری
  const now = new Date();

  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}`;

  // اولین روز ماه جاری
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  //اولین روز ماه بعد
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // دریافت بودجه ها بر اساس ماه جاری
  const budgets = await getBudgetsService({
    userId,
    month,
  });

  // دریافت دسته بندی ها
  const categories = await getCategoriesService({
    userId,
    select: { id: true, name: true, type: true },
  });

  //محاسبه هزینه‌ها بر اساس دسته بندی
  const spending = await getBudgetSpendingService({
    userId,
    categoryIds: budgets.map((item) => item.categoryId),
    startDate,
    endDate,
  });

  const spendingMap = new Map(
    spending.map((item) => [item.categoryId, item._sum.amount ?? 0n]),
  );

  // عملیات روی هر بودجه
  const budgetItems = budgets.map((item) => {
    //مقدار هزینه‌شده.
    const spent = spendingMap.get(item.categoryId) ?? 0n;
    //سقف بودجه
    const limit = item.limit;
    //درصد
    const percent = limit > 0n ? Number((spent * 100n) / limit) : 0;
    //باقیمانده
    const remaining = limit - spent;

    return {
      ...item,
      spent,
      remaining,
      percent,
      isOver: spent > limit,
      isWarning: spent >= (limit * 80n) / 100n && spent <= limit,
    };
  });

  //مجموع بودجه
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.limit, 0n);
  //مجموع هزینه شده
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0n);
  //باقی مانده
  const totalRemaining = totalBudget - totalSpent;
  //درصد مصرف
  const totalPercent =
    totalBudget > 0n ? Number((totalSpent * 100n) / totalBudget) : 0;

  const currentMonth = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    year: "numeric",
  }).format(now);
  return (
    <main className="mx-auto max-w-7xl space-y-5 p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold">بودجه‌بندی</h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            مدیریت و کنترل هزینه‌های ماهانه
          </p>
        </div>

        {/* باتن ایجاد بودجه */}
        <BudgetManager categories={categories.filter((cat) => cat.type === "expense")} />
      </header>

      {/* Current Month */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <FiCalendar />
        <span>بودجه ماه {currentMonth}</span>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SummaryCard
          title="کل بودجه"
          amount={totalBudget}
          icon={<FiTarget />}
          color="blue"
        />

        <SummaryCard
          title="مصرف‌شده"
          amount={totalSpent}
          icon={<FiShoppingBag />}
          color="rose"
        />

        <SummaryCard
          title="باقی‌مانده"
          amount={totalRemaining}
          icon={<FiMoreHorizontal />}
          color={totalRemaining < 0n ? "rose" : "emerald"}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              درصد مصرف
            </span>

            <FiTarget className="text-xl text-purple-600" />
          </div>

          <p className="text-2xl font-bold">
            {totalPercent.toLocaleString("fa-IR")}٪
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-purple-600"
              style={{
                width: `${Math.min(totalPercent, 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Budget List */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-slate-800">
          <div>
            <h2 className="font-bold">بودجه دسته‌بندی‌ها</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              میزان مصرف بودجه در هر دسته
            </p>
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            {budgets.length.toLocaleString("fa-IR")} بودجه
          </span>
        </div>

        {budgetItems.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {budgetItems.map((item) => {
              const statusColor = item.isOver
                ? "text-rose-600"
                : item.isWarning
                  ? "text-amber-500"
                  : "text-emerald-600";

              const progressColor = item.isOver
                ? "bg-rose-500"
                : item.isWarning
                  ? "bg-amber-500"
                  : "bg-emerald-500";

              return (
                <div
                  key={item.id}
                  className="p-5 transition hover:bg-gray-50 dark:hover:bg-slate-800/40"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {categoryIcons[item.category.name] ?? (
                          <FiMoreHorizontal />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-medium">
                          {item.category.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          سقف بودجه: {formatToman(item.limit)} تومان
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className={`text-xs font-medium ${statusColor}`}>
                        {item.isOver
                          ? "بیش از حد"
                          : `${item.percent.toLocaleString("fa-IR")}٪`}
                      </span>

                      <BudgetManager
                        categories={budgets.map((item) => item.category)}
                        initialData={{
                          id: item.id,
                          categoryId: item.categoryId,
                          limit: Number(item.limit),
                          month: item.month,
                        }}
                      />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        مصرف‌شده: {formatToman(item.spent)} تومان
                      </span>

                      <span className="text-gray-500 dark:text-gray-400">
                        {item.remaining >= 0n
                          ? `باقی‌مانده: ${formatToman(item.remaining)} تومان`
                          : `تجاوز از بودجه: ${formatToman(-item.remaining)} تومان`}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${progressColor}`}
                        style={{
                          width: `${Math.min(item.percent, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FiTarget />
            </div>

            <h3 className="font-bold">هنوز بودجه‌ای تعریف نکردی</h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              برای کنترل هزینه‌ها، اولین بودجه ماهانه خودت رو ایجاد کن.
            </p>

            <Link
              href="/budgets/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm text-white transition hover:bg-blue-700"
            >
              <FiPlus />
              ایجاد اولین بودجه
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryCard({
  title,
  amount,
  icon,
  color,
}: {
  title: string;
  amount: bigint;
  icon: React.ReactNode;
  color: "blue" | "rose" | "emerald";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    emerald:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>

        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${colors[color]}`}
        >
          {icon}
        </span>
      </div>

      <p className="text-xl font-bold">{formatToman(amount)}</p>

      <span className="mt-2 block text-xs text-gray-500 dark:text-gray-400">
        تومان
      </span>
    </div>
  );
}
