import "server-only"
import { prisma } from "../prisma";
import {
  CreateTransactionParams,
  DeleteTransactionParams,
  UpdateTransactionParams,
  UserTransactionParams,
} from "../types/transaction";
import { getAccountService } from "./account.service";
import { getCategoryService } from "./category.service";

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


//ایجاد تراکنش جدید
export async function createTransactionService({
  userId,
  data,
}: CreateTransactionParams) {
  // بررسی حساب
  const account = await getAccountService({
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
  const category = await getCategoryService({
    userId,
    categoryId: data.categoryId,
  });

  if (!category) {
    throw new Error("دسته‌بندی معتبر نیست");
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


// ویرایش تراکنش
export async function updateTransactionService({
  userId,
  transactionId,
  data,
}: UpdateTransactionParams) {
  // بررسی وجود تراکنش و مالکیت آن
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
  });

  if (!transaction) {
    throw new Error("تراکنش موردنظر پیدا نشد");
  }

  // بررسی حساب جدید
  const account = await getAccountService({
    userId,
    accountId: data.accountId,
  });

  if (!account) {
    throw new Error("حساب موردنظر معتبر نیست");
  }

  if (!account.isActive) {
    throw new Error("حساب موردنظر فعال نیست");
  }

  // بررسی دسته‌بندی جدید
  const category = await getCategoryService({
    userId,
    categoryId: data.categoryId,
  });

  if (!category) {
    throw new Error("دسته‌بندی معتبر نیست");
  }

  // آپدیت تراکنش
  return prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
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





// حذف تراکنش
export async function deleteTransactionService({
  userId,
  transactionId,
}: DeleteTransactionParams) {
  // بررسی وجود تراکنش و مالکیت آن
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!transaction) {
    throw new Error("تراکنش موردنظر پیدا نشد");
  }

  // حذف تراکنش
  return prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });
}
