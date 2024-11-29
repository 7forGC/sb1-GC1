-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Create custom types
create type user_role as enum ('user', 'admin');
create type post_type as enum ('image', 'video');
create type story_type as enum ('image', 'video');

-- Create profiles table
create table public.profiles (
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

-- Create posts table
create table public.posts (
  id uuid default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  caption text,
  media_url text not null,
  media_type post_type not null,
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Create comments table
create table public.comments (
  id uuid default uuid_generate_v4(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- Create likes table
create table public.likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- Create follows table
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Create stories table
create table public.stories (
  id uuid default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  media_url text not null,
  media_type story_type not null,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '24 hours',
  primary key (id)
);

-- Create story_views table
create table public.story_views (
  story_id uuid references public.stories(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (story_id, user_id)
);

-- Create bookmarks table
create table public.bookmarks (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- Create hashtags table
create table public.hashtags (
  id uuid default uuid_generate_v4(),
  name citext unique not null,
  created_at timestamptz default now(),
  primary key (id)
);

-- Create post_hashtags table
create table public.post_hashtags (
  post_id uuid references public.posts(id) on delete cascade,
  hashtag_id uuid references public.hashtags(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, hashtag_id)
);

-- Set up Row Level Security (RLS)

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
alter table public.stories enable row level security;
alter table public.story_views enable row level security;
alter table public.bookmarks enable row level security;
alter table public.hashtags enable row level security;
alter table public.post_hashtags enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Posts policies
create policy "Posts are viewable by everyone"
  on public.posts for select
  using (true);

create policy "Users can create posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- Comments policies
create policy "Comments are viewable by everyone"
  on public.comments for select
  using (true);

create policy "Users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Likes policies
create policy "Likes are viewable by everyone"
  on public.likes for select
  using (true);

create policy "Users can insert likes"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Follows policies
create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- Stories policies
create policy "Stories are viewable by followers"
  on public.stories for select
  using (
    exists (
      select 1 from public.follows
      where follower_id = auth.uid()
      and following_id = stories.user_id
    )
    or auth.uid() = user_id
  );

create policy "Users can create stories"
  on public.stories for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own stories"
  on public.stories for delete
  using (auth.uid() = user_id);

-- Story views policies
create policy "Story views are viewable by story owner"
  on public.story_views for select
  using (
    exists (
      select 1 from public.stories
      where id = story_views.story_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert story views"
  on public.story_views for insert
  with check (auth.uid() = user_id);

-- Bookmarks policies
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Create functions and triggers

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create updated_at triggers for relevant tables
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

-- Function to automatically create a profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();