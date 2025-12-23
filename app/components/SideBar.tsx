"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  ShieldCheck,
  Truck,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Delivery Management", href: "/delivery", icon: Truck },
  { name: "Sales", href: "/sales", icon: TrendingUp },
  { name: "Business Verification", href: "/verification", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 hidden bg-[#1A1A1A] text-white md:flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center border-b-[0.5px] border-white/25 gap-3">
        <div className="w-12 h-12 bg-white rounded-full"></div>
        <span className="text-2xl font-bold text-[#FFB800]">Farm2Store</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-[#FFB800] text-black font-medium"
                  : "text-gray-300 hover:bg-[#2A2A2A]"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t-[0.5px] border-white/25">
        <button className="flex items-center gap-3 px-5 py-3.5 rounded-lg w-full text-gray-300 hover:bg-[#2A2A2A] transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
