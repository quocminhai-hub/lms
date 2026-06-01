"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, DownloadCloud, Gift, Settings, LogOut } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Khóa học", href: "/dashboard/courses", icon: BookOpen },
    { name: "Tài nguyên", href: "/dashboard/resources", icon: DownloadCloud },
    { name: "Bonus Ultra", href: "/dashboard/bonus", icon: Gift },
    { name: "Cài đặt", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen border-r border-border bg-card flex flex-col justify-between fixed top-0 left-0 p-4">
      <div>
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            M
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">MINH AI</h2>
            <p className="text-xs text-muted-foreground opacity-70">Học viên</p>
          </div>
        </div>

        <div className="mb-4 px-3">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Điều hướng</div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-secondary text-primary font-medium"
                      : "text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-primary" : "opacity-70"} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div>
        <Link
          href="/"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50"
        >
          <LogOut size={18} className="opacity-70" />
          <span>Đăng xuất</span>
        </Link>
      </div>
    </div>
  );
}
