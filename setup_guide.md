# Hướng Dẫn Sao Chép Và Xây Dựng Website LMS (Next.js + Supabase)

Tài liệu này tổng hợp toàn bộ cấu trúc cơ sở dữ liệu (Database), Cơ chế phân quyền (RLS Policies), cấu trúc thư mục Next.js và các điểm cốt lõi để anh có thể tự tạo hoặc nhân bản một website học trực tuyến tương tự.

---

## 1. Cấu Trúc Cơ Sở Dữ Liệu (Supabase SQL)

Anh vào mục **SQL Editor** trên Supabase của dự án mới và chạy lần lượt các đoạn mã SQL sau:

### Bước 1.1: Tạo các bảng dữ liệu cơ bản
```sql
-- Kích hoạt extension sinh mã UUID tự động
create extension if not exists "uuid-ossp";

-- Bảng thông tin người dùng (Profiles - Đồng bộ từ Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'student' check (role in ('admin', 'student')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Khóa học (Courses)
create table public.courses (
  id text primary key, -- Mã ID khóa học dạng viết liền không dấu, ví dụ: shopee-affiliate
  title text not null,
  description text,
  price_base integer default 499000,
  price_ultra integer default 799000,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Chương học (Modules)
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Bài học (Lessons)
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade,
  title text not null,
  video_url text, -- Mã ID video (ví dụ YouTube ID: dQw4w9WgXcQ)
  duration text, -- Thời lượng, ví dụ: "15:30"
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Đăng ký & Thanh toán (Enrollments)
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id text references public.courses(id) on delete cascade,
  plan text check (plan in ('base', 'ultra')),
  amount integer not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Tiến trình học tập (Progress)
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  is_completed boolean default false,
  note text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);
```

### Bước 1.2: Cấu hình Trigger tự động tạo Profile khi Đăng Ký
Đoạn mã này giúp tự động tạo một hàng trong bảng `public.profiles` chứa Tên và Số điện thoại ngay sau khi người dùng đăng ký tài khoản thành công ở phần Auth.
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 2. Thiết Lập Bảo Mật & Phân Quyền (RLS Policies)

Mặc định khi bật **Row Level Security (RLS)** trên Supabase, các bảng sẽ bị khóa. Anh cần chạy lệnh sau để thiết lập phân quyền (Admin được toàn quyền ghi, học viên được đọc nội dung học).

```sql
-- Kích hoạt bảo mật RLS trên tất cả các bảng
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;

-- 1. Tạo hàm kiểm tra Admin (sử dụng "security definer" để tránh vòng lặp đệ quy RLS)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Phân quyền bảng PROFILES
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.is_admin());

-- 3. Phân quyền bảng COURSES
create policy "Public courses are viewable by everyone" on public.courses for select using (is_published = true);
create policy "Admins can insert courses" on public.courses for insert with check (public.is_admin());
create policy "Admins can update courses" on public.courses for update using (public.is_admin());
create policy "Admins can delete courses" on public.courses for delete using (public.is_admin());

-- 4. Phân quyền bảng MODULES (Chương học)
create policy "Allow public read access for modules" on public.modules for select using (true);
create policy "Allow admin full access for modules" on public.modules for all using (public.is_admin());

-- 5. Phân quyền bảng LESSONS (Bài học)
create policy "Allow public read access for lessons" on public.lessons for select using (true);
create policy "Allow admin full access for lessons" on public.lessons for all using (public.is_admin());

-- 6. Phân quyền bảng ENROLLMENTS (Đăng ký học viên)
create policy "Users can insert their own enrollments" on public.enrollments for insert with check (auth.uid() = user_id);
create policy "Admins can view all enrollments" on public.enrollments for select using (public.is_admin());
create policy "Admins can update all enrollments" on public.enrollments for update using (public.is_admin());
```

---

## 3. Cấu Trúc Thư Mục Next.js (App Router)

Cấu trúc thư mục được gom nhóm bằng **Route Groups** để tái sử dụng giao diện (Layout) rất sạch sẽ:

```text
src/
├── app/
│   ├── (public)/                 # Nhóm trang công khai (không cần layout Dashboard)
│   │   ├── login/
│   │   │   └── page.tsx          # Trang Đăng nhập (dùng signInWithPassword)
│   │   └── register/
│   │       └── page.tsx          # Trang Đăng ký (dùng signUp & chèn dữ liệu đăng ký)
│   │
│   ├── (dashboard)/              # Nhóm trang có Sidebar và Header chung
│   │   ├── layout.tsx            # Bọc chung thanh menu trái DashboardSidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Trang Tổng quan của học viên
│   │   └── admin/                # Nhóm chức năng Quản trị
│   │       ├── users/
│   │       │   └── page.tsx      # Duyệt học viên đăng ký mới
│   │       ├── courses/
│   │       │   ├── page.tsx      # Quản lý danh sách khóa học (CRUD)
│   │       │   └── [courseId]/
│   │       │       └── page.tsx  # Quản lý Chương học & Bài học chi tiết
│   │       └── revenue/
│   │           └── page.tsx      # Báo cáo doanh thu (đang phát triển)
│   │
│   ├── globals.css               # CSS phong cách Dark Mode Sleek
│   └── layout.tsx                # Layout gốc của toàn website
│
├── components/
│   └── DashboardSidebar.tsx      # Menu bên trái (Tự động hiển thị thẻ Admin nếu role = 'admin')
│
└── lib/
    └── supabase.ts               # Khởi tạo Supabase Client
```

---

## 4. Các Logic Code Cốt Lõi Cần Nhớ

### 4.1. Đăng ký & Ghi nhận khóa học của Học viên
Khi học viên đăng ký, bắt buộc phải viết mã kiểm tra lỗi và chặn lại nếu lệnh chèn (`insert`) vào bảng `enrollments` thất bại:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: { full_name: formData.name, phone: formData.phone }
  }
});

if (error) throw error;

if (data.user) {
  const { error: enrollError } = await supabase.from('enrollments').insert({
    user_id: data.user.id,
    course_id: 'shopee-affiliate', // Phải khớp với ID khóa học đã tạo trong DB
    plan: 'ultra',
    amount: 799000
  });

  if (enrollError) throw enrollError; // Chặn lại và báo lỗi nếu thất bại!
}
```

### 4.2. Đồng bộ Auth State & Profile trong Sidebar
Sử dụng hàm `supabase.auth.onAuthStateChange` để kiểm tra phiên đăng nhập và truy vấn bảng `profiles` nhằm lấy thông tin quyền hạn (`role = 'admin'`):
```typescript
useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
  };
  fetchUser();

  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) setProfile(data);
    } else {
      setProfile(null);
    }
  });

  return () => authListener.subscription.unsubscribe();
}, []);
```

---

## 5. Mẹo Triển Khai Cho Website Khác
1. **Thiết lập Supabase:** Nhớ tắt tính năng **"Confirm email"** trong mục `Auth` -> `Providers` -> `Email` trên Supabase nếu muốn tài khoản được kích hoạt ngay lập tức mà không cần nhấp link email xác nhận.
2. **Tạo trước khóa học:** Sau khi website khởi tạo, Admin phải đăng nhập và tạo ngay khóa học đầu tiên (ví dụ mã ID: `shopee-affiliate`) để đảm bảo hệ thống không bị lỗi ràng buộc khóa ngoại khi học viên bấm Đăng ký.
