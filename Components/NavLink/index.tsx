
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiChart, BiData, BiHome } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { GoGoal } from "react-icons/go";
import type { IconType } from "react-icons";

type NavItem = {
  title: string;
  path: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { title: "داشبورد", path: "/", icon: BiHome },
  { title: "تراکنش‌ها", path: "/transactions", icon: BiData },
  { title: "بودجه", path: "/budgets", icon: GoGoal },
  { title: "گزارش‌ها", path: "/reports", icon: BiChart },
  { title: "تنظیمات", path: "/settings", icon: CiSettings },
];

type SidebarLinkProps = {
  mobile?: boolean;
};

export default function SidebarLink({
  mobile = false,
}: SidebarLinkProps) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map(({ title, path, icon: Icon }) => {
        const isActive = pathname === path;

        return (
          <Link
            href={path}
            key={path}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center rounded-lg transition-colors ${
              mobile
                ? "min-w-0 flex-1 flex-col gap-1 px-1 py-2 text-[11px]"
                : "gap-3 p-3"
            } ${
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className="text-xl" />
            <span>{title}</span>
          </Link>
        );
      })}
    </>
  );
}
