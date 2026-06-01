import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-12 flex flex-col items-center text-center">
      <h1 className="text-5xl font-bold mb-6">
        Xin chào, mình là <span className="text-primary">Minh AI</span>
      </h1>
      <p className="text-muted-foreground max-w-2xl text-lg mb-10 opacity-80 leading-relaxed">
        Mình chia sẻ những con đường cụ thể để tạo nguồn thu nhập thứ 2 online 
        — ứng dụng AI đơn giản mà ai cũng có thể làm được. Không lý thuyết dài dòng, chỉ có cách làm thật.
      </p>

      <div className="flex items-center space-x-4 mb-20">
        <Link 
          href="/courses"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg flex items-center transition-all"
        >
          Xem khóa học <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link 
          href="/community"
          className="bg-secondary hover:bg-secondary/80 text-foreground font-medium px-6 py-3 rounded-lg flex items-center transition-all"
        >
          <Users className="mr-2 w-5 h-5" /> Tham gia cộng đồng
        </Link>
      </div>

      <div className="w-full">
        <p className="text-sm text-muted-foreground mb-8">
          Đã đào tạo <strong className="text-foreground">hàng ngàn học viên</strong> qua các lớp trực tiếp & online
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl overflow-hidden h-48 relative border border-border shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop" 
              alt="Offline class" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden h-48 relative border border-border shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" 
              alt="Group photo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-xl overflow-hidden h-48 relative border border-border shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop" 
              alt="Zoom call" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 bg-card border border-border rounded-xl p-8 max-w-2xl w-full">
        <h3 className="text-xl font-medium mb-2">Liên hệ với mình nếu cần tư vấn chi tiết nhất</h3>
        <div className="flex items-center justify-center space-x-2 text-primary text-xl font-bold mt-4">
          <span className="text-2xl">📱</span>
          <span>Zalo: 0989177200</span>
        </div>
      </div>
    </div>
  );
}
