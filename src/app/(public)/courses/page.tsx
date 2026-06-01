import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

export default function CoursesPage() {
  const courses = [
    {
      id: "shopee-affiliate",
      title: "AI - Shopee Affiliate | Dùng AI tạo nguồn thu nhập thứ 2",
      description: "Khóa học hướng dẫn bạn xây dựng kênh video AI từ con số 0, kiếm tiền tự động với 7 dạng video viral.",
      isHot: true,
    },
    {
      id: "quyen-dong-hanh",
      title: "Quyền ĐỒNG HÀNH",
      description: "",
      isHot: true,
    },
    {
      id: "tao-video-ai",
      title: "Tạo VIDEO AI - Dùng AI tạo nguồn thu nhập thứ 2",
      description: "Khóa học hướng dẫn bạn xây dựng kênh video AI từ con số 0, kiếm tiền tự động với 7 dạng video viral.",
      isHot: true,
    },
    {
      id: "name-to-net",
      title: "NAME-TO-NET — Phương pháp BIẾN TÊN THÀNH TIỀN",
      description: "Khóa 14 ngày xây thương hiệu cá nhân từ trải nghiệm sống — biến tên thành dòng tiền online bền vững trong kỷ nguyên AI.",
      isHot: true,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Khóa học</h1>
        <p className="text-muted-foreground">Các chương trình đào tạo của Minh AI</p>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-card border border-border p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/50"
          >
            <div className="flex-1">
              {course.isHot && (
                <div className="flex items-center text-primary text-xs font-semibold mb-2">
                  <Flame size={14} className="mr-1" /> Hot
                </div>
              )}
              <h2 className="text-xl font-bold text-foreground mb-2">{course.title}</h2>
              {course.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">{course.description}</p>
              )}
            </div>
            
            <div>
              <Link 
                href={`/register?course=${course.id}`}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg flex items-center transition-all whitespace-nowrap text-sm"
              >
                Xem chi tiết <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
