import { getCurrentUserId } from "@/lib/api/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

// GET /api/budgets?month=2026-10
export async function GET(request: Request) {
  const userId = await getCurrentUserId();
  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return NextResponse.json(
        { message: "فرمت ماه معتبر نیست؛ مثال: 2026-10" },
        { status: 400 },
      );
    }

    const budgets = await prisma.budget.findMany({
      where: { userId, ...(month ? { month } : {}) },
      orderBy: {
        category: {
          name: "asc",
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    const serializedBudgets = budgets.map((budget) => ({
      ...budget,
      limit: budget.limit.toString(),
    }));

    return NextResponse.json(serializedBudgets);
  } catch (error) {
    console.error("Get budgets error:", error);

    return NextResponse.json(
      { message: "خطا در دریافت بودجه‌ها" },
      { status: 500 },
    );
  }
}

// POST /api/budgets
export async function POST(request: Request) {
  let body: unknown;
  const userId = await getCurrentUserId();
  if (userId == null) {
    return NextResponse.json(
      { message: "ابتدا وارد حساب کاربری شوید" },
      { status: 401 },
    );
  }

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "بدنه درخواست معتبر نیست" },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { message: "اطلاعات بودجه نامعتبر است" },
      { status: 400 },
    );
  }

  const { categoryId, limit, month } = body as Record<string, unknown>;

  if (
    typeof categoryId !== "number" ||
    !Number.isSafeInteger(categoryId) ||
    categoryId <= 0 ||
    typeof month !== "string" ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)
  ) {
    return NextResponse.json(
      { message: "اطلاعات بودجه نامعتبر است" },
      { status: 400 },
    );
  }

  // تبدیل مبلغ به رشته عدد صحیح
  let limitString: string;

  if (typeof limit === "number" && Number.isSafeInteger(limit)) {
    limitString = String(limit);
  } else if (typeof limit === "string" && /^\d+$/.test(limit.trim())) {
    limitString = limit.trim();
  } else {
    return NextResponse.json(
      { message: "مبلغ بودجه باید عدد صحیح باشد" },
      { status: 400 },
    );
  }

  const budgetLimit = BigInt(limitString);

  // محدودیت نوع BigInt در PostgreSQL
  if (budgetLimit <= BigInt(0) || budgetLimit > BigInt("9223372036854775807")) {
    return NextResponse.json(
      { message: "مبلغ بودجه خارج از محدوده مجاز است" },
      { status: 400 },
    );
  }

  try {
    // بررسی وجود دسته‌بندی
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
      select: { id: true, name: true, type: true },
    });

    if (!category) {
      return NextResponse.json(
        { message: "دسته‌بندی پیدا نشد" },
        { status: 404 },
      );
    }

    // بودجه فقط برای دسته‌بندی هزینه تعریف می‌شود.
    if (category.type !== "expense") {
      return NextResponse.json(
        { message: "بودجه باید به دسته‌بندی هزینه متصل باشد" },
        { status: 400 },
      );
    }

    const budget = await prisma.budget.create({
      data: { categoryId, limit: budgetLimit, month, userId },
      include: {
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
        ...budget,
        limit: budget.limit.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "برای این دسته‌بندی در این ماه بودجه ثبت شده است" },
        { status: 409 },
      );
    }

    console.error("Create budget error:", error);

    return NextResponse.json({ message: "خطا در ثبت بودجه" }, { status: 500 });
  }
}
