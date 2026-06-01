"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle, ChevronDown, Save } from "lucide-react";

export default function CoursePlayerPage({ params }: { params: { id: string } }) {
  const [activeModule, setActiveModule] = useState(1);
  const [activeLesson, setActiveLesson] = useState(1);
  const [note, setNote] = useState("");

  const courseData = {
    title: "AI - Shopee Affiliate | Dùng AI tạo nguồn thu nhập thứ 2",
    modules: [
      {
        id: 1,
        title: "Phần 1: Nền Tảng - Hiểu Về Video AI",
        lessons: [
          { id: 1, title: "Giới thiệu khóa học", duration: "4 phút", completed: true },
          { id: 2, title: "AI Video là gì? Các dạng...", duration: "5 phút", completed: false },
          { id: 3, title: "Các nền tảng kiếm tiền", duration: "5 phút", completed: false },
        ]
      },
      {
        id: 2,
        title: "Phần 2: Hướng dẫn tạo và Edit",
        lessons: [
          { id: 4, title: "Quy trình làm video cơ bản", duration: "10 phút", completed: false },
          { id: 5, title: "Thực hành Edit Capcut", duration: "15 phút", completed: false },
        ]
      },
      {
        id: 3,
        title: "Phần 3: 11 Dạng Video Viral",
        lessons: [
          { id: 6, title: "Dạng 1: Video kể chuyện", duration: "12 phút", completed: false },
          { id: 7, title: "Dạng 2: Video review", duration: "8 phút", completed: false },
        ]
      }
    ]
  };

  const currentLessonData = courseData.modules
    .flatMap(m => m.lessons)
    .find(l => l.id === activeLesson);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left Sidebar - Playlist */}
      <div className="w-full lg:w-80 bg-card border border-border rounded-xl flex flex-col h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-foreground">Nội dung khóa học</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {courseData.modules.map((module) => (
            <div key={module.id} className="border-b border-border last:border-b-0">
              <button 
                onClick={() => setActiveModule(activeModule === module.id ? 0 : module.id)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-sm text-foreground">{module.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {module.lessons.filter(l => l.completed).length}/{module.lessons.length} bài
                  </p>
                </div>
                <ChevronDown size={16} className={`transition-transform ${activeModule === module.id ? "rotate-180" : ""}`} />
              </button>
              
              {activeModule === module.id && (
                <div className="bg-secondary/10 pb-2">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`w-full text-left px-4 py-3 flex items-start space-x-3 transition-colors ${
                        activeLesson === lesson.id 
                          ? "bg-primary/10 border-l-2 border-primary" 
                          : "hover:bg-secondary/30 border-l-2 border-transparent"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                      ) : (
                        <PlayCircle size={16} className={`${activeLesson === lesson.id ? 'text-primary' : 'text-muted-foreground'} mt-0.5 shrink-0`} />
                      )}
                      <div>
                        <p className={`text-sm ${activeLesson === lesson.id ? 'font-medium text-primary' : 'text-foreground'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Video & Notes */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Video Player Placeholder */}
        <div className="bg-black w-full aspect-video rounded-xl border border-border shadow-lg flex items-center justify-center relative overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
            alt="Video placeholder" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <button className="z-10 bg-primary/90 text-primary-foreground rounded-full p-4 transform transition-transform group-hover:scale-110">
            <PlayCircle size={48} />
          </button>
        </div>

        <div className="flex justify-between items-center bg-card border border-border p-4 rounded-xl">
          <h1 className="text-xl font-bold text-foreground">{currentLessonData?.title}</h1>
          <button className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
            <CheckCircle size={16} className="mr-2" /> Hoàn thành
          </button>
        </div>

        {/* Notes Section */}
        <div className="bg-card border border-border rounded-xl p-4 flex-1 min-h-[200px] flex flex-col">
          <div className="flex items-center text-primary font-medium mb-3">
            <Save size={18} className="mr-2" /> Ghi chú
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú của bạn cho bài học này..."
            className="flex-1 w-full bg-secondary/30 text-foreground border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
          ></textarea>
          <div className="mt-3 flex justify-end">
            <button className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg text-sm transition-colors flex items-center">
              Lưu ghi chú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
