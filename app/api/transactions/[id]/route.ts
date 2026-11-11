
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/api/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT /api/transactions/[id]
export async function PUT(
  request: Request,
  { params }: RouteContext,
) {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const transactionId = Number(id);

  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
    return NextResponse.json(
      { message: "شناسه تراکنش معتبر نیست" },
      { status: 400 },
    );
  }

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

  try {
    // بررسی وجود تراکنش متعلق به کاربر
    const existing = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "تراکنش پیدا نشد" },
        { status: 404 },
      );
    }

    // مقادیر جدید یا مقادیر قبلی
    const title = body.title ?? existing.title;
    const accountId = body.accountId ?? existing.accountId;
    const categoryId = body.categoryId ?? existing.categoryId;
    const description =
      body.description !== undefined
        ? body.description
        : existing.description;

    if (
      typeof title !== "string" ||
      !title.trim() ||
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

    // اعتبارسنجی مبلغ
    let amount = existing.amount;

    if (body.amount !== undefined) {
      let amountString: string;

      if (
        typeof body.amount === "number" &&
        Number.isSafeInteger(body.amount)
      ) {
        amountString = String(body.amount);
      } else if (
        typeof body.amount === "string" &&
        /^\d+$/.test(body.amount.trim())
      ) {
        amountString = body.amount.trim();
      } else {
        return NextResponse.json(
          { message: "مبلغ معتبر نیست" },
          { status: 400 },
        );
      }

      amount = BigInt(amountString);

      if (amount <= BigInt(0)) {
        return NextResponse.json(
          { message: "مبلغ باید بیشتر از صفر باشد" },
          { status: 400 },
        );
      }
    }

    if (
      description !== null &&
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { message: "توضیحات معتبر نیست" },
        { status: 400 },
      );
    }

    // اعتبارسنجی تاریخ
    let date = existing.date;

    if (body.date !== undefined) {
      if (typeof body.date !== "string") {
        return NextResponse.json(
          { message: "تاریخ معتبر نیست" },
          { status: 400 },
        );
      }

      date = new Date(body.date);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { message: "تاریخ معتبر نیست" },
          { status: 400 },
        );
      }
    }

    // بررسی حساب و دسته‌بندی
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
        { message: "حساب یا دسته‌بندی پیدا نشد" },
        { status: 404 },
      );
    }

    if (!account.isActive) {
      return NextResponse.json(
        { message: "این حساب غیرفعال است" },
        { status: 400 },
      );
    }

    // نوع تراکنش از دسته‌بندی مشخص می‌شود
    if (
      body.type !== undefined &&
      body.type !== category.type
    ) {
      return NextResponse.json(
        { message: "نوع دسته‌بندی با نوع تراکنش مطابقت ندارد" },
        { status: 400 },
      );
    }

    // بروزرسانی تراکنش
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        title: title.trim(),
        amount,
        accountId,
        categoryId,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        date,
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

    return NextResponse.json({
      ...updatedTransaction,
      amount: updatedTransaction.amount.toString(),
    });

  } catch (error) {
    console.error("Update transaction error:", error);

    return NextResponse.json(
      { message: "خطا در ویرایش تراکنش" },
      { status: 500 },
    );
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  request: Request,
  { params }: RouteContext,
) {
  const userId = await getCurrentUserId();

  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const transactionId = Number(id);

  if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
    return NextResponse.json(
      { message: "شناسه تراکنش معتبر نیست" },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "تراکنش پیدا نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "تراکنش با موفقیت حذف شد",
    });

  } catch (error) {
    console.error("Delete transaction error:", error);

    return NextResponse.json(
      { message: "خطا در حذف تراکنش" },
      { status: 500 },
    );
  }
}
