import type { Metadata } from "next";
import "./globals.css";
import SideBar from "./components/SideBar";

export const metadata: Metadata = {
  title: "Banana Co. - Dashboard",
  description: "B2B Banana Business Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-[#F5F5F0]">
          <SideBar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
