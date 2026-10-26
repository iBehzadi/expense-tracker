import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { createSession } from "../../../../lib/api/auth";

const registerSchema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "اطلاعات ارسالی معتبر نیست" },
      { status: 400 },
    );
  }

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "ایمیل یا اطلاعات ثبت‌نام معتبر نیست؛ رمز باید حداقل ۸ کاراکتر باشد" },
      { status: 400 },
    );
  }

  const { name, email, password } = result.data;

  // bcrypt بیش از ۷۲ بایت از رمز را پشتیبانی نمی‌کند.
  if (Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json(
      { message: "رمز عبور بیش از حد طولانی است" },
      { status: 400 },
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email,
        passwordHash,

        // دسته‌بندی‌های اولیه مخصوص این کاربر
        categories: {
          create: [
            { name: "حقوق", type: "income", isDefault: true },
            { name: "سایر درآمدها", type: "income", isDefault: true },
            { name: "خوراک", type: "expense", isDefault: true },
            { name: "حمل‌ونقل", type: "expense", isDefault: true },
            { name: "مسکن", type: "expense", isDefault: true },
            { name: "سلامت", type: "expense", isDefault: true },
            { name: "تفریح", type: "expense", isDefault: true },
            { name: "سایر هزینه‌ها", type: "expense", isDefault: true },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    console.error("Register error:", error);

    return NextResponse.json(
      { message: "خطا در ثبت‌نام" },
      { status: 500 },
    );
  }
}