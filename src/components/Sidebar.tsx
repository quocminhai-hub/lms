"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, Users, LogIn } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Khóa học", href: "/courses", icon: BookOpen },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Cộng đồng", href: "/community", icon: Users },
  ];

  return (
    <div className="w-64 h-screen border-r border-border bg-card flex flex-col justify-between fixed top-0 left-0 p-4">
      <div>
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            MA
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Minh AI</h2>
            <p className="text-xs text-muted-foreground opacity-70">AI & Affiliate Creator</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
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

      <div>
        <Link
          href="/login"
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50"
        >
          <LogIn size={18} className="opacity-70" />
          <span>Đăng nhập</span>
        </Link>
      </div>
    </div>
  );
}
