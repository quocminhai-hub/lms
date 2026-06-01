-- Chạy đoạn mã này trong phần SQL Editor của Supabase để cấp quyền cho Admin mà không bị lỗi đệ quy (infinite recursion)

-- 0. Tạo hàm kiểm tra Admin (chạy dưới quyền bảo mật cao hơn để tránh đệ quy RLS)
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

-- 1. Cho phép học viên tự thêm đơn đăng ký (enrollments)
drop policy if exists "Users can insert their own enrollments" on public.enrollments;
create policy "Users can insert their own enrollments" 
on public.enrollments for insert 
with check (auth.uid() = user_id);

-- 2. Cho phép Admin xem và cập nhật đơn đăng ký (enrollments)
drop policy if exists "Admins can view all enrollments" on public.enrollments;
create policy "Admins can view all enrollments" 
on public.enrollments for select 
using (public.is_admin());

drop policy if exists "Admins can update all enrollments" on public.enrollments;
create policy "Admins can update all enrollments" 
on public.enrollments for update 
using (public.is_admin());

-- 3. Cho phép Admin thêm và sửa khóa học (courses)
drop policy if exists "Admins can insert courses" on public.courses;
create policy "Admins can insert courses" 
on public.courses for insert 
with check (public.is_admin());

drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses" 
on public.courses for update 
using (public.is_admin());

-- 4. Cho phép Admin toàn quyền trên bảng profiles (để xem danh sách học viên)
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" 
on public.profiles for select 
using (public.is_admin());
