import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: " مدیریت هزینه",
  description: "مدیریت درآمد، هزینه و بودجه شخصی",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
