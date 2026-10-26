import { NextResponse } from "next/server";
import { clearSession } from "../../../../lib/api/auth";

export async function POST() {
  await clearSession();

  return NextResponse.json({
    message: "از حساب کاربری خارج شدید",
  });
}