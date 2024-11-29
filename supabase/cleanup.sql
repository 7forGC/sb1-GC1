-- Drop existing tables in the correct order to handle dependencies
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

-- Drop custom types
drop type if exists user_role cascade;
drop type if exists post_type cascade;
drop type if exists story_type cascade;

-- Drop triggers
drop trigger if exists handle_updated_at on public.profiles;
drop trigger if exists handle_updated_at on public.posts;
drop trigger if exists handle_updated_at on public.comments;
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions
drop function if exists public.handle_updated_at() cascade;
drop function if exists public.handle_new_user() cascade;