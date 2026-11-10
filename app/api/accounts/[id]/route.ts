import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/api/auth";
import {
  getUserAccount,
  updateUserAccount,
} from "@/lib/services/account.service";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Props) {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;
    const accountId = Number(id);

    if (!Number.isSafeInteger(accountId) || accountId <= 0) {
      return NextResponse.json(
        { message: "شناسه حساب معتبر نیست" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const allowedTypes = ["BANK", "CASH", "SAVINGS", "OTHER"];

    if (!name || name.length > 100 || !allowedTypes.includes(body.type)) {
      return NextResponse.json(
        { message: "نام یا نوع حساب معتبر نیست" },
        { status: 400 },
      );
    }

    const initialBalance = body.initialBalance;

    if (typeof initialBalance !== "string" || !/^\d+$/.test(initialBalance)) {
      return NextResponse.json(
        { message: "موجودی اولیه معتبر نیست" },
        { status: 400 },
      );
    }

    const result = await updateUserAccount({
      id: accountId,
      isActive: true,
      userId,
      input: {
        name: body.name,
        type: body.type,
        initialBalance: body.initialBalance,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: "حساب پیدا نشد" }, { status: 404 });
    }

    const account = await getUserAccount({ userId, accountId });

    return NextResponse.json({
      ...account,
      initialBalance: account!.initialBalance.toString(),
    });
  } catch {
    return NextResponse.json(
      { message: "خطا در ویرایش حساب" },
      { status: 400 },
    );
  }
}
