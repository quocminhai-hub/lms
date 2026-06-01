import { BookOpen, CheckCircle, Clock, ListVideo } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          Xin chào, MINH AI! <span className="ml-2">👋</span>
        </h1>
        <p className="text-muted-foreground mt-1">Tiếp tục hành trình học tập của bạn</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Khóa học của bạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/courses/shopee-affiliate" className="bg-card border border-primary p-4 rounded-xl flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">AI - Shopee Affiliate | Dùng AI tạo nguồn thu nhập thứ 2</h3>
                <p className="text-xs text-muted-foreground">Gói Ultra</p>
              </div>
            </div>
            <div className="text-muted-foreground">→</div>
          </Link>

          <Link href="/dashboard/courses/quyen-dong-hanh" className="bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:bg-secondary/50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary p-2 rounded-lg text-foreground">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Quyền ĐỒNG HÀNH</h3>
                <p className="text-xs text-muted-foreground">Gói Ultra</p>
              </div>
            </div>
            <div className="text-muted-foreground">→</div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center text-primary mb-2">
            <CheckCircle size={18} className="mr-2" />
            <span className="font-bold text-xl text-foreground">0/32</span>
          </div>
          <p className="text-xs text-muted-foreground">Bài đã hoàn thành</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center text-primary mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary mr-2" />
            <span className="font-bold text-xl text-foreground">0%</span>
          </div>
          <p className="text-xs text-muted-foreground">Tiến độ</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center text-primary mb-2">
            <Clock size={18} className="mr-2" />
            <span className="font-bold text-xl text-foreground">5h 6p</span>
          </div>
          <p className="text-xs text-muted-foreground">Tổng thời lượng</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl">
          <div className="flex items-center text-primary mb-2">
            <ListVideo size={18} className="mr-2" />
            <span className="font-bold text-xl text-foreground">5</span>
          </div>
          <p className="text-xs text-muted-foreground">Số module</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">Tiến độ tổng thể</h3>
          <span className="text-primary font-bold text-sm">0%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
}
