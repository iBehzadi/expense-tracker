"use client";

import DefButton from "./button";
import { logoutAction } from "@/lib/actions/auth";

export default function LogoutButton() {

  async function handleOut() {
    await logoutAction();
  }

  return <DefButton title="خروج از حساب" color="red" onBtnClick={handleOut} />;
}
