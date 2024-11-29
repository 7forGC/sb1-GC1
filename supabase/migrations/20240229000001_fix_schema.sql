-- Drop existing tables if they exist (in correct order)
drop table if exists public.post_hashtags cascade;
drop table if exists public.hashtags cascade;
drop table if exists public.bookmarks cascade;
drop table if exists public.story_views cascade;
drop table if exists public.stories cascade;
drop table if exists public.follows cascade;
drop table if exists public.likes cascade;
drop table if exists public.comments cascade;
drop table if exists public.posts cascade;
drop table if exists public.profiles cascade;

-- Safely create or update types
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type user_role as enum ('user', 'admin');
    end if;
    
    if not exists (select 1 from pg_type where typname = 'post_type') then
        create type post_type as enum ('image', 'video');
    end if;
    
    if not exists (select 1 from pg_type where typname = 'story_type') then
        create type story_type as enum ('image', 'video');
    end if;
end $$;

-- Create tables with if not exists
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade,
    username citext unique not null,
    full_name text,
    avatar_url text,
    bio text,
    website text,
    role user_role default 'user',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    primary key (id)
);

-- Rest of the tables...
-- (Include all table creation statements from the original migration,
-- but add "if not exists" to each create table statement)

-- Recreate functions and triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Drop existing triggers before recreating
drop trigger if exists handle_updated_at on public.profiles;
drop trigger if exists handle_updated_at on public.posts;
drop trigger if exists handle_updated_at on public.comments;

-- Recreate triggers
create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.posts
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.comments
    for each row
    execute function public.handle_updated_at();

-- Update the handle_new_user function
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username, avatar_url)
    values (
        new.id,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'avatar_url'
    )
    on conflict (id) do nothing;
    return new;
end;
$$ language plpgsql security definer;