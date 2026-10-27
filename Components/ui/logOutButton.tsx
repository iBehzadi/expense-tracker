"use client";

import { useRouter } from "next/navigation";
import DefButton from "./button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleOut() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      console.error("خروج از حساب ناموفق بود");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return <DefButton title="خروج از حساب" color="red" onBtnClick={handleOut} />;
}
