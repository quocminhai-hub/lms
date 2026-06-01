"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, Users, CreditCard } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function RevenuePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    ultraCount: 0,
    baseCount: 0
  });

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enrollments')
      .select('amount, plan')
      .eq('status', 'approved');

    if (data && !error) {
      let revenue = 0;
      let ultra = 0;
      let base = 0;
      
      data.forEach(item => {
        revenue += item.amount;
        if (item.plan === 'ultra') ultra++;
        if (item.plan === 'base') base++;
      });

      setStats({
        totalRevenue: revenue,
        totalUsers: data.length,
        ultraCount: ultra,
        baseCount: base
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Gói Ultra', value: stats.ultraCount },
    { name: 'Gói Base', value: stats.baseCount },
  ];
  const COLORS = ['#f59e0b', '#3b82f6'];

  const barData = [
    { name: 'Tuần 1', revenue: stats.totalRevenue * 0.2 },
    { name: 'Tuần 2', revenue: stats.totalRevenue * 0.3 },
    { name: 'Tuần 3', revenue: stats.totalRevenue * 0.1 },
    { name: 'Tuần 4', revenue: stats.totalRevenue * 0.4 },
  ];

  if (loading) return <div className="text-muted-foreground">Đang tải dữ liệu doanh thu...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Báo cáo Doanh thu</h1>
        <p className="text-muted-foreground mt-1">Thống kê tổng quan hoạt động kinh doanh khóa học</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="bg-primary/20 p-4 rounded-full text-primary">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Tổng doanh thu</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalRevenue.toLocaleString('vi-VN')} đ</h3>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="bg-green-500/20 p-4 rounded-full text-green-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Học viên đã duyệt</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.totalUsers} người</h3>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl flex items-center space-x-4 shadow-sm">
          <div className="bg-blue-500/20 p-4 rounded-full text-blue-500">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Tỷ lệ mua gói Ultra</p>
            <h3 className="text-2xl font-bold text-foreground">
              {stats.totalUsers ? Math.round((stats.ultraCount / stats.totalUsers) * 100) : 0}%
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-foreground mb-6">Doanh thu theo tuần (Ước tính)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a'}} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-foreground mb-6">Tỷ trọng Gói Đăng ký</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center text-sm"><div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div> Ultra ({stats.ultraCount})</div>
            <div className="flex items-center text-sm"><div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-2"></div> Base ({stats.baseCount})</div>
          </div>
        </div>
      </div>
    </div>
  );
}
