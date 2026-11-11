import { prisma } from "../prisma";
import { getUserAccount } from "./account.service";
type UserTransactionParams = {
  userId: number;
  count?: number;
};

//دریافت تراکنش های کاربر
export async function getTransactionsService({
  userId,
  count,
}: UserTransactionParams) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: count,
    include: {
      category: {
        select: {
          name: true,
          type: true,
        },
      },
    },
  });
}

//دریافت تراکنش های ورودی



//ایجاد تراکنش جدید
type TransactionInput = {
  title: string;
  amount: string;
  accountId: number;
  categoryId: number;
  description?: string;
  date?: Date;
};

type CreateTransactionParams = {
  userId: number;
  data: TransactionInput;
};


export async function createTransactionService({
  userId,
  data,
}: CreateTransactionParams) {
  // بررسی حساب
  const account = await getUserAccount({
    userId,
    accountId: data.accountId,
  });

  if (!account) {
    throw new Error("حساب موردنظر معتبر نیست");
  }

  if (!account.isActive) {
    throw new Error("حساب موردنظر فعال نیست");
  }

  // بررسی دسته‌بندی
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      userId,
    },
  });

  if (!category) {
    throw new Error("دسته‌بندی موردنظر معتبر نیست");
  }

  // ایجاد تراکنش
  return prisma.transaction.create({
    data: {
      userId,
      accountId: data.accountId,
      categoryId: data.categoryId,
      title: data.title,
      amount: BigInt(data.amount),
      description: data.description?.trim() || null,
      ...(data.date && { date: data.date }),
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });
}
