
"use server";

import { getCurrentUserId } from "@/lib/api/auth";
import {
  createUserAccount,
  updateUserAccount,
} from "@/lib/services/account.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const accountSchema = z.object({
  name: z.string().trim().min(1, "نام حساب الزامی است").max(100),
  type: z.enum(["BANK", "CASH", "SAVINGS", "OTHER"]),
  initialBalance: z.string().regex(/^\d+$/, "موجودی معتبر نیست"),
});

// ایجاد حساب
export async function createAccountAction(input: unknown) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { success: false, message: "ابتدا وارد حساب کاربری شوید" };
  }

  const validation = accountSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message,
    };
  }

  try {
    await createUserAccount({
      userId,
      input: validation.data,
    });

    revalidatePath("/accounts");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Create account error:", error);

    return {
      success: false,
      message: "خطا در ذخیره حساب",
    };
  }
}

// ویرایش حساب
export async function updateAccountAction(
  accountId: number,
  input: unknown,
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { success: false, message: "ابتدا وارد حساب کاربری شوید" };
  }

  if (!Number.isSafeInteger(accountId) || accountId <= 0) {
    return { success: false, message: "شناسه حساب معتبر نیست" };
  }

  const validation = accountSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message,
    };
  }

  try {
    const result = await updateUserAccount({
      id: accountId,
      userId,
      isActive: true,
      input: validation.data,
    });

    if (result.count === 0) {
      return { success: false, message: "حساب پیدا نشد" };
    }

    revalidatePath("/accounts");
    revalidatePath("/");
    revalidatePath("/transactions");

    return { success: true };
  } catch (error) {
    console.error("Update account error:", error);

    return {
      success: false,
      message: "خطا در ویرایش حساب",
    };
  }
}
