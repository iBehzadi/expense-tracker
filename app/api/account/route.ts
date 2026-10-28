
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/api/auth";

// دریافت حساب‌های کاربر لاگین‌شده
export async function GET() {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 }
    );
  }

  const accounts = await prisma.account.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(accounts);
}

// ایجاد حساب جدید
export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const allowedTypes = ["BANK", "CASH", "SAVINGS", "OTHER"];

    if (
      !name ||
      name.length > 100 ||
      (body.type !== undefined && !allowedTypes.includes(body.type))
    ) {
      return NextResponse.json(
        { message: "نام یا نوع حساب معتبر نیست" },
        { status: 400 }
      );
    }

    const initialBalance = body.initialBalance ?? "0";

    if (
      typeof initialBalance !== "string" ||
      !/^\d+$/.test(initialBalance)
    ) {
      return NextResponse.json(
        { message: "موجودی اولیه باید عدد صحیح نامنفی باشد" },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        name,
        type: body.type ?? "BANK",
        initialBalance: BigInt(initialBalance),
        userId,
      },
    });

    return NextResponse.json(
      {
        ...account,
        initialBalance: account.initialBalance.toString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "خطا در ایجاد حساب" },
      { status: 400 }
    );
  }
}
