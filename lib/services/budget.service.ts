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
