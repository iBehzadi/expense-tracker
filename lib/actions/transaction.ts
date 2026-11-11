"use server";

import { getCurrentUserId } from "@/lib/api/auth";
import { createTransactionService } from "@/lib/services/transaction.service";
import { updateTransactionService } from "@/lib/services/transaction.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteTransactionService } from "@/lib/services/transaction.service";

// ============================  create transaction action   =======================

export const transactionSchema = z.object({
  title: z.string().trim().min(1, "عنوان الزامی است").max(100),
  amount: z.string().regex(/^[1-9]\d*$/, "مبلغ معتبر نیست"),
  accountId: z.number().int().positive("حساب معتبر نیست"),
  categoryId: z.number().int().positive("دسته‌بندی معتبر نیست"),
  description: z.string().trim().max(500).optional(),
  date: z.coerce.date().optional(),
});

export type TransactionInput = z.input<typeof transactionSchema>;
export type ValidatedTransactionInput = z.output<typeof transactionSchema>;

export async function createTransactionAction(data: TransactionInput) {
  try {
    // احراز هویت
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("لطفاً وارد حساب کاربری شوید");
    }
    const validation = transactionSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0].message,
      };
    }

    // ایجاد تراکنش
    const transaction = await createTransactionService({
      userId,
      data: validation.data,
    });

    return {
      success: true,
      data: transaction,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "خطا در ایجاد تراکنش",
    };
  }
}

// ============================ update transaction action =======================

const updateTransactionSchema = transactionSchema.extend({
  transactionId: z.number().int().positive("شناسه تراکنش معتبر نیست"),
});

type UpdateTransactionInput = z.input<typeof updateTransactionSchema>;


export async function updateTransactionAction(data: UpdateTransactionInput) {
  try {
    // احراز هویت
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("لطفاً وارد حساب کاربری شوید");
    }

    // اعتبارسنجی اطلاعات
    const validation = transactionSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0].message,
      };
    }

    // آپدیت تراکنش
    const transaction = await updateTransactionService({
      userId,
      transactionId : data.transactionId,
      data: validation.data,
    });

    // بروزرسانی صفحات
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return {
      success: true,
      data: transaction,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "خطا در ویرایش تراکنش",
    };
  }
}




// حذف تراکنش
export async function deleteTransactionAction(transactionId: number) {
  try {
    // احراز هویت
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("لطفاً وارد حساب کاربری شوید");
    }

    // اعتبارسنجی شناسه
    const validation = z.number().int().positive().safeParse(transactionId);

    if (!validation.success) {
      return {
        success: false,
        message: "شناسه تراکنش معتبر نیست",
      };
    }

    // حذف تراکنش
    await deleteTransactionService({
      userId,
      transactionId: validation.data,
    });

    // بروزرسانی صفحات
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "خطا در حذف تراکنش",
    };
  }
}
