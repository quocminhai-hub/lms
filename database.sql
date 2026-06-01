-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Extended from auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'student' check (role in ('admin', 'student')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COURSES TABLE
create table public.courses (
  id text primary key,
  title text not null,
  description text,
  price_base integer default 499000,
  price_ultra integer default 799000,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MODULES TABLE
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LESSONS TABLE
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete cascade,
  title text not null,
  video_url text,
  duration text,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENROLLMENTS / PAYMENTS TABLE
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id text references public.courses(id) on delete cascade,
  plan text check (plan in ('base', 'ultra')),
  amount integer not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER PROGRESS TABLE
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  is_completed boolean default false,
  note text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- RLS (Row Level Security) Policies
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;

-- Simple Policies (Can be refined later)
create policy "Public courses are viewable by everyone" on public.courses for select using (is_published = true);
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger to automatically create a profile when a user signs up
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
