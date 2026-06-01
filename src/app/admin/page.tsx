"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "nva@gmail.com", phone: "0901234567", plan: "ULTRA", amount: "799,000", status: "pending", date: "2023-10-27" },
    { id: 2, name: "Trần Thị B", email: "ttb@gmail.com", phone: "0987654321", plan: "BASE", amount: "499,000", status: "pending", date: "2023-10-27" },
    { id: 3, name: "Lê Văn C", email: "lvc@gmail.com", phone: "0912345678", plan: "ULTRA", amount: "799,000", status: "approved", date: "2023-10-26" }
  ]);

  const handleApprove = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "approved" } : u));
    alert("Đã duyệt tài khoản thành công! Học viên có thể đăng nhập ngay.");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Duyệt học viên</h1>
          <p className="text-muted-foreground mt-1">Quản lý các tài khoản đăng ký mới và chờ thanh toán</p>
        </div>
        <div className="bg-card border border-border px-4 py-2 rounded-lg text-sm">
          Tổng chờ duyệt: <span className="text-primary font-bold">{users.filter(u => u.status === "pending").length}</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/50 border-b border-border text-sm text-muted-foreground">
              <th className="p-4 font-medium">Học viên</th>
              <th className="p-4 font-medium">Liên hệ</th>
              <th className="p-4 font-medium">Gói đăng ký</th>
              <th className="p-4 font-medium">Số tiền</th>
              <th className="p-4 font-medium">Trạng thái</th>
              <th className="p-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.date}</div>
                </td>
                <td className="p-4">
                  <div>{user.email}</div>
                  <div className="text-xs text-muted-foreground">{user.phone}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.plan === 'ULTRA' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="p-4 font-medium">{user.amount} đ</td>
                <td className="p-4">
                  {user.status === "pending" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">
                      Chờ thanh toán
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-500">
                      Đã duyệt
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {user.status === "pending" ? (
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleApprove(user.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-1.5 rounded-md transition-colors"
                        title="Duyệt (Đã nhận tiền)"
                      >
                        <Check size={16} />
                      </button>
                      <button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-1.5 rounded-md transition-colors bg-red-500 text-white" title="Từ chối">
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
