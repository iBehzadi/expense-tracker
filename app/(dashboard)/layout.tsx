import React from "react";
import DashboardNavbar from "@/Components/DashboardNavbar";

import NavLink from "@/Components/NavLink";


export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardNavbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden min-h-[calc(100vh-3.5rem)] w-64 shrink-0 border-l border-gray-200 bg-white p-4 md:flex md:flex-col dark:border-gray-700 dark:bg-gray-900">
          <nav className="flex flex-col gap-2">
            <NavLink />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white px-1 md:hidden dark:border-gray-700 dark:bg-gray-900">
        <NavLink mobile />
      </nav>
    </div>
  );
}
