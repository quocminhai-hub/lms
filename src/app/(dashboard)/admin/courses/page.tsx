"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Video, X } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price_base: 499000,
    price_ultra: 799000,
    is_published: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    setErrorMsg("");
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg("Lỗi tải danh sách khóa học: " + error.message);
    } else if (data) {
      setCourses(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      id: "",
      title: "",
      description: "",
      price_base: 499000,
      price_ultra: 799000,
      is_published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: any) => {
    setEditingCourse(course);
    setFormData({
      id: course.id,
      title: course.title,
      description: course.description || "",
      price_base: course.price_base || 499000,
      price_ultra: course.price_ultra || 799000,
      is_published: course.is_published
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "price_base" || name === "price_ultra") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (editingCourse) {
        // Update
        const { error } = await supabase
          .from('courses')
          .update({
            title: formData.title,
            description: formData.description,
            price_base: formData.price_base,
            price_ultra: formData.price_ultra,
            is_published: formData.is_published
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
      } else {
        // Insert
        // Đảm bảo ID không trống và viết liền, không dấu/ký tự đặc biệt (dạng slug)
        const courseId = formData.id.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const { error } = await supabase
          .from('courses')
          .insert({
            id: courseId,
            title: formData.title,
            description: formData.description,
            price_base: formData.price_base,
            price_ultra: formData.price_ultra,
            is_published: formData.is_published
          });

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      setErrorMsg("Lỗi lưu khóa học: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"? Tất cả bài giảng và đơn đăng ký liên quan sẽ bị xóa.`)) {
      return;
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Lỗi khi xóa: " + error.message);
    } else {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !currentStatus })
      .eq('id', id);
    if (!error) {
      setCourses(courses.map(c => c.id === id ? { ...c, is_published: !currentStatus } : c));
    } else {
      alert("Lỗi cập nhật trạng thái: " + error.message);
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
          onClick={handleOpenAddModal}
        >
          <Plus size={18} className="mr-2" /> Thêm khóa học
        </button>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg text-sm mb-6 border border-red-500/30">
          {errorMsg}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border text-sm text-muted-foreground">
              <th className="p-4 font-medium w-24">Mã KH (ID)</th>
              <th className="p-4 font-medium w-1/3">Tên khóa học</th>
              <th className="p-4 font-medium">Giá BASE</th>
              <th className="p-4 font-medium">Giá ULTRA</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium text-right">Quản lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Đang tải...</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Chưa có khóa học nào. Hãy thêm khóa học đầu tiên của bạn!</td></tr>
            ) : courses.map((course) => (
              <tr key={course.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4 font-mono text-xs text-muted-foreground">{course.id}</td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{course.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-xs">{course.description || "Chưa có mô tả"}</div>
                </td>
                <td className="p-4 font-medium">{course.price_base?.toLocaleString('vi-VN')} đ</td>
                <td className="p-4 font-medium">{course.price_ultra?.toLocaleString('vi-VN')} đ</td>
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
                    <Link href={`/admin/courses/${course.id}`} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition-colors" title="Quản lý Bài giảng">
                      <Video size={16} />
                    </Link>
                    <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Sửa khóa học" onClick={() => handleOpenEditModal(course)}>
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Xóa khóa học" onClick={() => handleDelete(course.id, course.title)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingCourse ? "Cập Nhật Khóa Học" : "Thêm Khóa Học Mới"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!editingCourse && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Mã khóa học (ID / Slug)</label>
                  <input 
                    required 
                    type="text" 
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: shopee-affiliate" 
                    className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Dùng làm ID liên kết đăng ký. Ví dụ: shopee-affiliate</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tên khóa học</label>
                <input 
                  required 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: AI Shopee Affiliate" 
                  className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Mô tả ngắn</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả cho khóa học..." 
                  rows={3}
                  className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Giá gói BASE (đ)</label>
                  <input 
                    required 
                    type="number" 
                    name="price_base"
                    value={formData.price_base}
                    onChange={handleInputChange}
                    className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Giá gói ULTRA (đ)</label>
                  <input 
                    required 
                    type="number" 
                    name="price_ultra"
                    value={formData.price_ultra}
                    onChange={handleInputChange}
                    className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded border-border text-primary focus:ring-primary bg-secondary w-4 h-4"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Xuất bản ngay (Hiển thị công khai)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu khóa học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
