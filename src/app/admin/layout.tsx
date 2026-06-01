import Link from "next/link";
import { Users, DollarSign, LayoutDashboard, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground">
      <div className="w-64 border-r border-border bg-card flex flex-col justify-between fixed top-0 left-0 p-4 h-full">
        <div>
          <div className="mb-8 px-2 mt-4">
            <h2 className="font-bold text-xl text-primary">ADMIN PANEL</h2>
            <p className="text-xs text-muted-foreground">Quản trị hệ thống LMS</p>
          </div>

          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors bg-secondary text-primary font-medium">
              <Users size={18} /> <span>Duyệt học viên</span>
            </Link>
            <Link href="/admin/revenue" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50">
              <DollarSign size={18} className="opacity-70" /> <span>Doanh thu</span>
            </Link>
            <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50 mt-4">
              <LayoutDashboard size={18} className="opacity-70" /> <span>Về trang chủ</span>
            </Link>
          </nav>
        </div>

        <div>
          <Link href="/login" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-secondary/50">
            <LogOut size={18} className="opacity-70" /> <span>Đăng xuất</span>
          </Link>
        </div>
      </div>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
