import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/api/auth";
import {
  createUserAccount,
  getUserAccounts,
} from "@/lib/services/account.service";

// دریافت حساب‌های کاربر لاگین‌شده
export async function GET() {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  const accounts = await getUserAccounts({ userId, isActive: true });

  return NextResponse.json(
    accounts.map((a) => ({
      ...a,
      initialBalance: a.initialBalance.toString(),
    })),
  );
}

// ایجاد حساب جدید
export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const allowedTypes = ["BANK", "CASH", "SAVINGS", "OTHER"];

    if (
      !name ||
      name.length > 100 ||
      (body.type !== undefined && !allowedTypes.includes(body.type))
    ) {
      return NextResponse.json(
        { message: "نام یا نوع حساب معتبر نیست" },
        { status: 400 },
      );
    }

    const initialBalance = body.initialBalance ?? "0";

    if (typeof initialBalance !== "string" || !/^\d+$/.test(initialBalance)) {
      return NextResponse.json(
        { message: "موجودی اولیه باید عدد صحیح نامنفی باشد" },
        { status: 400 },
      );
    }

    const account = await createUserAccount({
      userId,
      input: {
        name: body.name,
        type: body.type,
        initialBalance: body.initialBalance,
      },
    });

    return NextResponse.json(
      {
        ...account,
        initialBalance: account.initialBalance.toString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: "خطا در ایجاد حساب" }, { status: 400 });
  }
}
