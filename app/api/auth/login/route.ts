import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { createSession } from "../../../../lib/api/auth";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(72),
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

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "ایمیل یا رمز عبور نادرست است" },
      { status: 401 },
    );
  }

  const { email, password } = result.data;

  if (Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json(
      { message: "ایمیل یا رمز عبور نادرست است" },
      { status: 401 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "ایمیل یا رمز عبور نادرست است" },
        { status: 401 },
      );
    }

    const passwordIsValid = await compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        { message: "ایمیل یا رمز عبور نادرست است" },
        { status: 401 },
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      message: "ورود موفقیت‌آمیز بود",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "خطا در ورود به حساب کاربری" },
      { status: 500 },
    );
  }
}