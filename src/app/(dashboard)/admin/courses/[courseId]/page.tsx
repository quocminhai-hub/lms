"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, ArrowLeft, X, MoveUp, MoveDown, Play } from "lucide-react";
import Link from "next/link";

export default function CourseLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<{ [moduleId: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Module Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm, setModuleForm] = useState({ title: "", order_index: 1 });

  // Lesson Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string>("");
  const [lessonForm, setLessonForm] = useState({
    title: "",
    video_url: "",
    duration: "",
    order_index: 1
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Get Course Info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // 2. Get Modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      // 3. Get Lessons for each module
      if (modulesData && modulesData.length > 0) {
        const moduleIds = modulesData.map(m => m.id);
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;

        // Group lessons by module_id
        const groupedLessons: { [moduleId: string]: any[] } = {};
        modulesData.forEach(m => {
          groupedLessons[m.id] = [];
        });
        lessonsData?.forEach(lesson => {
          if (groupedLessons[lesson.module_id]) {
            groupedLessons[lesson.module_id].push(lesson);
          }
        });
        setLessons(groupedLessons);
      }
    } catch (err: any) {
      setErrorMsg("Lỗi tải dữ liệu khóa học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  // MODULE CRUD
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleForm({ title: "", order_index: modules.length + 1 });
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: any) => {
    setEditingModule(mod);
    setModuleForm({ title: mod.title, order_index: mod.order_index });
    setIsModuleModalOpen(true);
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingModule) {
        const { error } = await supabase
          .from('modules')
          .update({
            title: moduleForm.title,
            order_index: moduleForm.order_index
          })
          .eq('id', editingModule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('modules')
          .insert({
            course_id: courseId,
            title: moduleForm.title,
            order_index: moduleForm.order_index
          });
        if (error) throw error;
      }
      setIsModuleModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Lỗi khi lưu chương học: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (id: string, title: string) => {
    if (!confirm(`Bạn có muốn xóa chương học "${title}" và toàn bộ bài học bên trong không?`)) return;
    try {
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Lỗi khi xóa chương học: " + err.message);
    }
  };

  // LESSON CRUD
  const handleOpenAddLesson = (moduleId: string) => {
    setEditingLesson(null);
    setActiveModuleId(moduleId);
    const existingLessons = lessons[moduleId] || [];
    setLessonForm({
      title: "",
      video_url: "",
      duration: "",
      order_index: existingLessons.length + 1
    });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: any, moduleId: string) => {
    setEditingLesson(lesson);
    setActiveModuleId(moduleId);
    setLessonForm({
      title: lesson.title,
      video_url: lesson.video_url || "",
      duration: lesson.duration || "",
      order_index: lesson.order_index
    });
    setIsLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingLesson) {
        const { error } = await supabase
          .from('lessons')
          .update({
            title: lessonForm.title,
            video_url: lessonForm.video_url,
            duration: lessonForm.duration,
            order_index: lessonForm.order_index
          })
          .eq('id', editingLesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({
            module_id: activeModuleId,
            title: lessonForm.title,
            video_url: lessonForm.video_url,
            duration: lessonForm.duration,
            order_index: lessonForm.order_index
          });
        if (error) throw error;
      }
      setIsLessonModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Lỗi khi lưu bài học: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài học "${title}"?`)) return;
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert("Lỗi khi xóa bài học: " + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Back Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/admin/courses" className="p-2 hover:bg-secondary rounded-lg transition-colors border border-border">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Khóa học / Quản lý nội dung</span>
          <h1 className="text-2xl font-bold text-foreground">{course?.title || "Đang tải..."}</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg text-sm mb-6 border border-red-500/30">
          {errorMsg}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-foreground">Cấu trúc Chương mục & Bài giảng</h2>
        <button
          onClick={handleOpenAddModule}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
        >
          <Plus size={16} className="mr-2" /> Thêm Chương học
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Đang tải cấu trúc bài giảng...</div>
      ) : modules.length === 0 ? (
        <div className="bg-card border border-border border-dashed p-12 text-center rounded-2xl">
          <p className="text-muted-foreground mb-4">Khóa học này chưa có chương mục nào.</p>
          <button
            onClick={handleOpenAddModule}
            className="bg-secondary border border-border hover:bg-secondary/80 text-foreground font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Tạo chương học đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((mod) => {
            const modLessons = lessons[mod.id] || [];
            return (
              <div key={mod.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Module Header */}
                <div className="bg-secondary/35 border-b border-border p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="bg-secondary border border-border/80 text-foreground w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-semibold">
                      {mod.order_index}
                    </span>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground">{modLessons.length} bài học</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenAddLesson(mod.id)}
                      className="text-xs bg-primary/20 hover:bg-primary/30 text-primary font-semibold px-3 py-1.5 rounded-lg transition-colors mr-2"
                    >
                      + Thêm bài học
                    </button>
                    <button
                      onClick={() => handleOpenEditModule(mod)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded transition-colors"
                      title="Sửa chương học"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Xóa chương học"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="divide-y divide-border/60">
                  {modLessons.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground italic">
                      Chưa có bài học nào trong chương này.
                    </div>
                  ) : (
                    modLessons.map((lesson) => (
                      <div key={lesson.id} className="p-4 flex justify-between items-center hover:bg-secondary/10 transition-colors">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Play size={14} className="text-primary flex-shrink-0" />
                          <span className="font-mono text-xs text-muted-foreground w-6 flex-shrink-0">
                            {lesson.order_index}.
                          </span>
                          <div className="truncate pr-4">
                            <h4 className="font-medium text-foreground text-sm truncate">{lesson.title}</h4>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-0.5">
                              {lesson.duration && <span>Thời lượng: {lesson.duration}</span>}
                              {lesson.video_url && <span className="truncate max-w-xs font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border/30">Video: {lesson.video_url}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditLesson(lesson, mod.id)}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded transition-colors"
                            title="Sửa bài học"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            title="Xóa bài học"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingModule ? "Sửa Chương Học" : "Thêm Chương Học"}
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModuleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tên chương học</label>
                <input
                  required
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Ví dụ: Chương 1: Giới thiệu tổng quan"
                  className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Thứ tự hiển thị</label>
                <input
                  required
                  type="number"
                  value={moduleForm.order_index}
                  onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 1 })}
                  className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu chương học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {editingLesson ? "Sửa Bài Học" : "Thêm Bài Học Mới"}
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLessonSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tiêu đề bài học</label>
                <input
                  required
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Ví dụ: Bài 1.1: Cách tìm sản phẩm trend"
                  className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Mã Video (YouTube ID hoặc link Vimeo/Drive)</label>
                <input
                  type="text"
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="Ví dụ: dQw4w9WgXcQ"
                  className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Thời lượng (ví dụ: 12:45)</label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="15:30"
                    className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Thứ tự bài học</label>
                  <input
                    required
                    type="number"
                    value={lessonForm.order_index}
                    onChange={(e) => setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 1 })}
                    className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu bài học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
