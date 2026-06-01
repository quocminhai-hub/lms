"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserCourses = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Lấy danh sách đăng ký đã duyệt của học viên
          const { data, error } = await supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('user_id', user.id)
            .eq('status', 'approved');

          if (error) throw error;
          setEnrollments(data || []);
        }
      } catch (err: any) {
        console.error("Error fetching student courses:", err);
        setErrorMsg("Lỗi tải danh sách khóa học: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Khóa học của bạn</h1>
        <p className="text-muted-foreground mt-1">Danh sách các khóa học đã được kích hoạt thành viên</p>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg text-sm mb-6 border border-red-500/30">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Đang tải danh sách khóa học...</div>
      ) : enrollments.length === 0 ? (
        <div className="bg-card border border-border border-dashed p-12 text-center rounded-2xl">
          <p className="text-muted-foreground mb-4">Bạn chưa kích hoạt khóa học nào hoặc đang chờ Admin duyệt thanh toán.</p>
          <Link
            href="/courses"
            className="inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-5 rounded-lg text-sm transition-colors"
          >
            Khám phá Khóa học
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.courses;
            if (!course) return null;
            return (
              <div 
                key={enrollment.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm group"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                      <BookOpen size={20} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Gói {enrollment.plan}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {course.description || "Chưa có mô tả"}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-border/40 mt-auto flex justify-between items-center bg-secondary/5">
                  <span className="text-xs text-muted-foreground">Trạng thái: Đã kích hoạt</span>
                  <Link 
                    href={`/dashboard/courses/${course.id}`}
                    className="flex items-center text-sm font-semibold text-primary hover:underline"
                  >
                    Vào học ngay <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
