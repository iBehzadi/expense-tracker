import React from "react";
import DashboardNavbar from "@/Components/dashboard/DashboardNavbar";
import NavigationMenu from "@/Components/NavigationMenu";
import { getCurrentUserId } from "@/lib/api/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isUserLogin = await getCurrentUserId();
  if (!isUserLogin) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardNavbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden min-h-[calc(100vh-3.5rem)] w-64 shrink-0 border-l border-gray-200 bg-white p-4 md:flex md:flex-col dark:border-gray-700 dark:bg-gray-900">
          <nav className="flex flex-col gap-2">
            <NavigationMenu />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 ">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed  bottom-0 left-0 right-0 z-60 flex h-16 items-center justify-around border-t border-gray-200 bg-white px-1 md:hidden dark:border-gray-700 dark:bg-gray-900">
        <NavigationMenu mobile />
      </nav>

      {/* <button className="fixed bottom-20 left-5 rounded-full w-12 h-12 flex items-center justify-center bg-amber-400 px-4 py-2 text-white text-2xl">
        +
      </button> */}
    </div>
  );
}
