

"use server";
import { Prisma } from "@/app/generated/prisma/client";
import { z } from "zod";
import {revalidateApp} from "@/lib/revalidate";

import {
  createBudgetService,
  updateBudgetService,
  deleteBudgetService,
} from "@/lib/services/budget.service";
import { getCurrentUserId } from "@/lib/api/session";

// ایجاد بودجه
export async function createBudgetAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "لطفاً وارد حساب کاربری شوید" };
    }

    const schema = z.object({
      categoryId: z.number().int().positive("دسته‌بندی معتبر نیست"),
      limit: z
        .number()
        .int()
        .positive("سقف بودجه باید بیشتر از صفر باشد")
        .safe(),
      month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "ماه معتبر نیست"),
    });

    const validation = schema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const { categoryId, limit, month } = validation.data;

    await createBudgetService({
      userId,
      categoryId,
      limit: BigInt(limit),
      month,
    });

    revalidateApp();

    return { success: true, message: "بودجه با موفقیت ایجاد شد" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "برای این دسته‌بندی در این ماه قبلاً بودجه ثبت شده است",
      };
    }

    if (error instanceof Error && error.message === "INVALID_CATEGORY") {
      return { success: false, error: "دسته‌بندی معتبر نیست" };
    }

    console.error("Create budget error:", error);

    return { success: false, error: "خطا در ایجاد بودجه" };
  }
}

// ویرایش سقف بودجه
export async function updateBudgetAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "لطفاً وارد حساب کاربری شوید" };
    }

    const schema = z.object({
      budgetId: z.number().int().positive("شناسه بودجه معتبر نیست"),
      limit: z
        .number()
        .int()
        .positive("سقف بودجه باید بیشتر از صفر باشد")
        .safe(),
    });

    const validation = schema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const { budgetId, limit } = validation.data;

    const updated = await updateBudgetService({
      userId,
      budgetId,
      limit: BigInt(limit),
    });

    if (!updated) {
      return { success: false, error: "بودجه موردنظر پیدا نشد" };
    }

    revalidateApp();

    return { success: true, message: "سقف بودجه با موفقیت تغییر کرد" };
  } catch (error) {
    console.error("Update budget error:", error);

    return { success: false, error: "خطا در ویرایش بودجه" };
  }
}

// حذف بودجه
export async function deleteBudgetAction(id: unknown) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "لطفاً وارد حساب کاربری شوید" };
    }

    const schema = z.object({
      budgetId: z.number().int().positive("شناسه بودجه معتبر نیست"),
    });

    const validation = schema.safeParse({ budgetId: id });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const { budgetId } = validation.data;

    const deleted = await deleteBudgetService({
      userId,
      budgetId,
    });

    if (!deleted) {
      return { success: false, error: "بودجه موردنظر پیدا نشد" };
    }

    revalidateApp();
    return { success: true, message: "بودجه با موفقیت حذف شد" };
  } catch (error) {
    console.error("Delete budget error:", error);

    return { success: false, error: "خطا در حذف بودجه" };
  }
}
