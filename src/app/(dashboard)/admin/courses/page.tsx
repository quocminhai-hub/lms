"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Video } from "lucide-react";
import Link from "next/link";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setCourses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !currentStatus })
      .eq('id', id);
    if (!error) {
      setCourses(courses.map(c => c.id === id ? { ...c, is_published: !currentStatus } : c));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Khóa học</h1>
          <p className="text-muted-foreground mt-1">Thêm, sửa khóa học và bài giảng video</p>
        </div>
        <button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
          onClick={() => alert("Tính năng Thêm khóa học sẽ mở ở bản cập nhật tới!")}
        >
          <Plus size={18} className="mr-2" /> Thêm khóa học
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border text-sm text-muted-foreground">
              <th className="p-4 font-medium">Hình ảnh</th>
              <th className="p-4 font-medium w-1/3">Tên khóa học</th>
              <th className="p-4 font-medium">Giá bán</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium text-right">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Đang tải...</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Chưa có khóa học nào.</td></tr>
            ) : courses.map((course) => (
              <tr key={course.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4">
                  <div className="w-20 h-12 bg-secondary rounded overflow-hidden">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{course.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-xs">{course.description}</div>
                </td>
                <td className="p-4 font-medium">{course.price?.toLocaleString('vi-VN')} đ</td>
                <td className="p-4">
                  <button 
                    onClick={() => handleTogglePublish(course.id, course.is_published)}
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      course.is_published ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {course.is_published ? "Đang xuất bản" : "Bản nháp"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition-colors" title="Quản lý Bài giảng">
                      <Video size={16} />
                    </button>
                    <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa khóa học">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
