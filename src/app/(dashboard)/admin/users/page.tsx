"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchEnrollments = async () => {
    setLoading(true);
    setErrorMsg("");
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, profiles(full_name, phone), courses(title)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching enrollments:", error);
      setErrorMsg("Lỗi tải đơn đăng ký: " + error.message);
    } else if (data) {
      setEnrollments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      setEnrollments(enrollments.map(e => e.id === id ? { ...e, status: "approved" } : e));
      alert("Đã duyệt tài khoản thành công! Học viên có thể vào học ngay.");
    } else {
      alert("Lỗi khi duyệt: " + error.message);
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) {
      setEnrollments(enrollments.map(e => e.id === id ? { ...e, status: "rejected" } : e));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Duyệt học viên</h1>
          <p className="text-muted-foreground mt-1">Quản lý các tài khoản đăng ký mới và chờ thanh toán</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-lg text-sm">
          Tổng chờ duyệt: <span className="text-primary font-bold">{enrollments.filter(e => e.status === "pending").length}</span>
        </div>
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
              <th className="p-4 font-medium">Học viên</th>
              <th className="p-4 font-medium">Khóa học</th>
              <th className="p-4 font-medium">Gói đăng ký</th>
              <th className="p-4 font-medium">Số tiền</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Đang tải dữ liệu...</td></tr>
            ) : enrollments.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Chưa có học viên nào đăng ký.</td></tr>
            ) : enrollments.map((enrollment) => (
              <tr key={enrollment.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-foreground">{enrollment.profiles?.full_name || 'Khách'}</div>
                  <div className="text-xs text-muted-foreground">{enrollment.profiles?.phone || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(enrollment.created_at).toLocaleDateString('vi-VN')}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium max-w-[200px] truncate">{enrollment.courses?.title || enrollment.course_id}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${enrollment.plan === 'ultra' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                    {enrollment.plan}
                  </span>
                </td>
                <td className="p-4 font-medium">{enrollment.amount?.toLocaleString('vi-VN')} đ</td>
                <td className="p-4">
                  {enrollment.status === "pending" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">
                      Chờ thanh toán
                    </span>
                  ) : enrollment.status === "approved" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-500">
                      Đã duyệt
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-500">
                      Từ chối
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {enrollment.status === "pending" ? (
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleApprove(enrollment.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-1.5 rounded-md transition-colors"
                        title="Duyệt (Đã nhận tiền)"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleReject(enrollment.id)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-1.5 rounded-md transition-colors bg-red-500 text-white" 
                        title="Từ chối"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs italic">Không có hành động</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
