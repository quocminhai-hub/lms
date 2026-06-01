-- Chạy đoạn mã này trong phần SQL Editor của Supabase để cấp quyền cho Admin

-- 1. Cho phép học viên tự thêm đơn đăng ký (enrollments)
create policy "Users can insert their own enrollments" 
on public.enrollments for insert 
with check (auth.uid() = user_id);

-- 2. Cho phép Admin toàn quyền trên bảng enrollments
create policy "Admins can view all enrollments" 
on public.enrollments for select 
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can update all enrollments" 
on public.enrollments for update 
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. Cho phép Admin toàn quyền trên bảng courses
create policy "Admins can insert courses" 
on public.courses for insert 
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins can update courses" 
on public.courses for update 
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. Cho phép Admin toàn quyền trên bảng profiles (để xem danh sách học viên)
create policy "Admins can view all profiles" 
on public.profiles for select 
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
