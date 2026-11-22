import "server-only";
import { prisma } from "../prisma";

// دریافت بودجه‌های کاربر
export async function getBudgetsService({
  userId,
  month,
}: {
  userId: number;
  month: string;
}) {
  return prisma.budget.findMany({
    where: {
      userId,
      month,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// محاسبه هزینه هر دسته‌بندی در ماه
export async function getBudgetSpendingService({
  userId,
  categoryIds, // e. [23,43,...]
  startDate,
  endDate,
}: {
  userId: number;
  categoryIds: number[];
  startDate: Date;
  endDate: Date;
}) {
  if (categoryIds.length === 0) return [];

  return prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      categoryId: { in: categoryIds },
      category: {
        type: "expense",
      },
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });
}


// ایجاد بودجه
export async function createBudgetService({
  userId,
  categoryId,
  limit,
  month,
}: {
  userId: number;
  categoryId: number;
  limit: bigint;
  month: string;
}) {
  // بررسی مالکیت و نوع دسته‌بندی
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
      type: "expense",
    },
    select: { id: true },
  });

  if (!category) {
    throw new Error("INVALID_CATEGORY");
  }

  return prisma.budget.create({
    data: {
      userId,
      categoryId,
      limit,
      month,
    },
  });
}

// ویرایش سقف بودجه
export async function updateBudgetService({
  userId,
  budgetId,
  limit,
}: {
  userId: number;
  budgetId: number;
  limit: bigint;
}) {
  const result = await prisma.budget.updateMany({
    where: {
      id: budgetId,
      userId,
    },
    data: {
      limit,
    },
  });

  return result.count > 0;
}

// حذف بودجه
export async function deleteBudgetService({
  userId,
  budgetId,
}: {
  userId: number;
  budgetId: number;
}) {
  const result = await prisma.budget.deleteMany({
    where: {
      id: budgetId,
      userId,
    },
  });

  return result.count > 0;
}