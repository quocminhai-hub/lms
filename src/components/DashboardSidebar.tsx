"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, DownloadCloud, Gift, Settings, LogOut, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm uppercase">
            {profile?.full_name ? profile.full_name.charAt(0) : "M"}
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm truncate max-w-[140px]">{profile?.full_name || "MINH AI"}</h2>
            <p className="text-xs text-muted-foreground opacity-70 capitalize">{profile?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</p>
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

        {profile?.role === 'admin' && (
          <div className="mt-8 px-3">
            <div className="text-xs text-red-500 font-medium uppercase tracking-wider mb-2">Quản trị Hệ thống</div>
            <nav className="space-y-1">
              <Link
                href="/dashboard/admin/users"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === "/dashboard/admin/users"
                    ? "bg-red-500/20 text-red-500 font-medium"
                    : "text-foreground hover:bg-red-500/10 hover:text-red-500"
                }`}
              >
                <ShieldAlert size={18} className={pathname === "/dashboard/admin/users" ? "text-red-500" : "opacity-70"} />
                <span>Duyệt học viên</span>
              </Link>
              
              <Link
                href="/dashboard/admin/courses"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === "/dashboard/admin/courses"
                    ? "bg-red-500/20 text-red-500 font-medium"
                    : "text-foreground hover:bg-red-500/10 hover:text-red-500"
                }`}
              >
                <BookOpen size={18} className={pathname === "/dashboard/admin/courses" ? "text-red-500" : "opacity-70"} />
                <span>Quản lý Khóa học</span>
              </Link>
              
              <Link
                href="/dashboard/admin/revenue"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === "/dashboard/admin/revenue"
                    ? "bg-red-500/20 text-red-500 font-medium"
                    : "text-foreground hover:bg-red-500/10 hover:text-red-500"
                }`}
              >
                <ShieldAlert size={18} className={pathname === "/dashboard/admin/revenue" ? "text-red-500" : "opacity-70"} />
                <span>Doanh thu</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50"
        >
          <LogOut size={18} className="opacity-70" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
