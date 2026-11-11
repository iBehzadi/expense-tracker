
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUserId } from "../../../../lib/api/session";

export async function PATCH(req: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "ابتدا وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = body.name;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { message: "نام کاربری الزامی است" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return NextResponse.json(
        { message: "نام باید بین ۲ تا ۵۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: trimmedName,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      message: "اطلاعات کاربری با موفقیت ویرایش شد",
      user,
    });

  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      { message: "خطا در ویرایش اطلاعات کاربری" },
      { status: 500 }
    );
  }
}
