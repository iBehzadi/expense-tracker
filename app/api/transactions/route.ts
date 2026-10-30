import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getCurrentUserId } from "@/lib/api/auth";

// GET /api/transactions
export async function GET() {
  const userId = await getCurrentUserId();
  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
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

    const serializedTransactions = transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toString(),
    }));

    return NextResponse.json(serializedTransactions);
  } catch (error) {
    console.error("Get transactions error:", error);

    return NextResponse.json(
      { message: "خطا در دریافت تراکنش‌ها" },
      { status: 500 },
    );
  }
}

// POST /api/transactions
export async function POST(request: Request) {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }
  // ابتدا JSON ورودی را بررسی می‌کنیم.
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { message: "بدنه درخواست معتبر نیست" },
      { status: 400 },
    );
  }

  if (
    typeof rawBody !== "object" ||
    rawBody === null ||
    Array.isArray(rawBody)
  ) {
    return NextResponse.json(
      { message: "اطلاعات تراکنش نامعتبر است" },
      { status: 400 },
    );
  }

  const body = rawBody as Record<string, unknown>;

  const title = body.title;
  const amount = body.amount;
  const type = body.type;
  const accountId = body.accountId;
  const categoryId = body.categoryId;
  const description = body.description;
  const date = body.date;

  // اعتبارسنجی فیلدهای اصلی
  if (
    typeof title !== "string" ||
    !title.trim() ||
    (type !== "income" && type !== "expense") ||
    typeof accountId !== "number" ||
    !Number.isSafeInteger(accountId) ||
    accountId <= 0 ||
    typeof categoryId !== "number" ||
    !Number.isSafeInteger(categoryId) ||
    categoryId <= 0
  ) {
    return NextResponse.json(
      { message: "اطلاعات تراکنش نامعتبر است" },
      { status: 400 },
    );
  }

  // مبلغ می‌تواند عدد صحیح یا رشته عددی باشد.
  // رشته برای مبالغ BigInt مناسب‌تر است.
  let amountString: string;

  if (typeof amount === "number" && Number.isSafeInteger(amount)) {
    amountString = String(amount);
  } else if (typeof amount === "string" && /^\d+$/.test(amount.trim())) {
    amountString = amount.trim();
  } else {
    return NextResponse.json(
      { message: "مبلغ باید یک عدد صحیح مثبت باشد" },
      { status: 400 },
    );
  }

  if (BigInt(amountString) <= BigInt(0)) {
    return NextResponse.json(
      { message: "مبلغ باید بیشتر از صفر باشد" },
      { status: 400 },
    );
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    return NextResponse.json(
      { message: "توضیحات معتبر نیست" },
      { status: 400 },
    );
  }

  // تاریخ اختیاری است؛ در صورت ارسال باید معتبر باشد.
  let transactionDate: Date | undefined;

  if (date !== undefined) {
    if (typeof date !== "string") {
      return NextResponse.json(
        { message: "تاریخ معتبر نیست" },
        { status: 400 },
      );
    }

    transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return NextResponse.json(
        { message: "تاریخ معتبر نیست" },
        { status: 400 },
      );
    }
  }

  try {
    // بررسی وجود حساب و دسته‌بندی
    const [account, category] = await Promise.all([
      prisma.account.findFirst({
        where: { id: accountId, userId },
        select: { id: true, isActive: true },
      }),
      prisma.category.findFirst({
        where: { id: categoryId, userId },
        select: { id: true, type: true },
      }),
    ]);

    if (!account || !category) {
      return NextResponse.json(
        { message: "حساب مالی یا دسته‌بندی پیدا نشد" },
        { status: 404 },
      );
    }

    if (category.type !== type) {
      return NextResponse.json(
        { message: "نوع دسته‌بندی با نوع تراکنش مطابقت ندارد" },
        { status: 400 },
      );
    }
    if (!account.isActive) {
      return NextResponse.json(
        { message: "این حساب غیرفعال است" },
        { status: 400 },
      );
    }
    
    const transaction = await prisma.transaction.create({
      data: {
        title: title.trim(),
        amount: BigInt(amountString),
        accountId,
        userId,
        categoryId,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        ...(transactionDate ? { date: transactionDate } : {}),
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

    return NextResponse.json(
      {
        ...transaction,
        amount: transaction.amount.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create transaction error:", error);

    return NextResponse.json({ message: "خطا در ثبت تراکنش" }, { status: 500 });
  }
}
