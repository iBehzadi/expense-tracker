import React from "react";
import AppHeader from "@/Components/dashboard/AppHeader";
import NavigationMenu from "@/Components/NavigationMenu";
import { getCurrentUserId } from "@/lib/api/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isUserLogin = await getCurrentUserId();

  if (!isUserLogin) {
    redirect("/login");
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <AppHeader />

      <div className="flex min-h-0 flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-l border-gray-200 bg-white p-4 md:flex md:flex-col dark:border-gray-700 dark:bg-gray-900">
          <nav className="flex flex-1 flex-col gap-2">
            <NavigationMenu />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="z-60 flex h-16 shrink-0 items-center justify-around border-t border-gray-200 bg-white px-1 md:hidden dark:border-gray-700 dark:bg-gray-900">
        <NavigationMenu mobile />
      </nav>
    </div>
  );
}