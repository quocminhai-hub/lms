"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, QrCode, CheckCircle2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "payment">("form");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    plan: "ultra"
  });

  const plans = [
    { id: "base", name: "BASE", price: "499K", desc: "3 tháng", amount: 499000 },
    { id: "ultra", name: "ULTRA", price: "799K", desc: "Trọn đời", amount: 799000 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (error) throw error;

      // TODO: Can create enrollment here or wait for trigger
      setStep("payment");
    } catch (error: any) {
      setErrorMsg(error.message || "Có lỗi xảy ra khi đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedPlanInfo = plans.find(p => p.id === formData.plan);
  
  // Fake Bank info for VietQR
  const bankBin = "970422"; // MB Bank
  const accountNo = "0989177200";
  const accountName = "MINH AI";
  const addInfo = `DK ${formData.phone} ${formData.plan.toUpperCase()}`;
  const qrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png?amount=${selectedPlanInfo?.amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className="max-w-md mx-auto py-12">
      {step === "form" ? (
        <div className="bg-card border border-border p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Đăng Ký</h1>
            <p className="text-muted-foreground text-sm">Tạo tài khoản để bắt đầu học</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Họ và tên</label>
              <input 
                required 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A" 
                className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
              <input 
                required 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="thuy.th123@gmail.com" 
                className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Số điện thoại</label>
              <input 
                required 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0901234567" 
                className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Mật khẩu</label>
              <input 
                required 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••" 
                className="w-full bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Chọn gói</label>
              <div className="grid grid-cols-2 gap-3">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                      formData.plan === plan.id 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase mb-1 flex justify-center items-center">
                      {plan.id === "ultra" && <span className="text-primary mr-1">👑</span>} {plan.name}
                    </div>
                    <div className="text-xl font-bold text-foreground">{plan.price}</div>
                    <div className="text-xs text-muted-foreground">{plan.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center transition-all mt-6"
            >
              <UserPlus size={18} className="mr-2" /> Đăng Ký
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản? <Link href="/login" className="text-primary hover:underline">Đăng nhập</Link>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Đăng ký thành công!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Vui lòng quét mã QR bên dưới để thanh toán. Tài khoản của bạn sẽ được kích hoạt ngay sau khi Admin duyệt.
          </p>

          <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-sm">
            <img src={qrUrl} alt="QR Code Thanh Toán" className="w-64 h-64 object-contain" />
          </div>

          <div className="bg-secondary p-4 rounded-lg text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Số tiền:</span>
              <span className="font-bold text-foreground">{selectedPlanInfo?.amount.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Nội dung:</span>
              <span className="font-bold text-foreground">{addInfo}</span>
            </div>
          </div>

          <Link 
            href="/dashboard"
            className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-medium py-3 rounded-lg flex items-center justify-center transition-all"
          >
            Đi đến Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
