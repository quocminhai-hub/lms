"use client";

import Link from "next/link";
import { Users, DollarSign, LayoutDashboard, LogOut, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        setIsAuthorized(true);
      } else {
        router.push("/");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAuthorized === null) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Đang tải...</div>;
  }

  return (
    <div className="flex w-full min-h-screen bg-background text-foreground">
      <div className="w-64 border-r border-border bg-card flex flex-col justify-between fixed top-0 left-0 p-4 h-full">
        <div>
          <div className="mb-8 px-2 mt-4">
            <h2 className="font-bold text-xl text-primary">ADMIN PANEL</h2>
            <p className="text-xs text-muted-foreground">Quản trị hệ thống LMS</p>
          </div>

          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 text-foreground font-medium">
              <Users size={18} className="text-primary" /> <span>Duyệt học viên</span>
            </Link>
            <Link href="/admin/courses" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 text-foreground font-medium">
              <BookOpen size={18} className="text-primary" /> <span>Quản lý Khóa học</span>
            </Link>
            <Link href="/admin/revenue" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50">
              <DollarSign size={18} className="text-primary" /> <span>Doanh thu</span>
            </Link>
            <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50 mt-4">
              <LayoutDashboard size={18} className="opacity-70" /> <span>Về trang chủ</span>
            </Link>
          </nav>
        </div>

        <div>
          <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50">
            <LogOut size={18} className="opacity-70" /> <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
