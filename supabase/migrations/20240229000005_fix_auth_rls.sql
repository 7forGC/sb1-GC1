-- Enable RLS on the auth schema
alter schema auth owner to supabase_auth_admin;

-- Create auth triggers and functions
create or replace function auth.check_user_role()
returns trigger as $$
begin
  if new.raw_user_meta_data->>'role' not in ('user', 'admin') then
    new.raw_user_meta_data = jsonb_set(
      coalesce(new.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"user"'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for user role validation
drop trigger if exists validate_user_role on auth.users;
create trigger validate_user_role
  before insert or update on auth.users
  for each row
  execute function auth.check_user_role();

-- Update auth policies
do $$
begin
  -- Drop existing policies
  drop policy if exists "Users can view own auth data" on auth.users;
  drop policy if exists "Users can update own auth data" on auth.users;

  -- Create new auth policies
  create policy "Users can view own auth data"
    on auth.users for select
    using (auth.uid() = id);

  create policy "Users can update own auth data"
    on auth.users for update
    using (auth.uid() = id)
    with check (auth.uid() = id);
end $$;

-- Add session handling improvements
create or replace function auth.handle_new_session()
returns trigger as $$
begin
  insert into public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    new_data
  ) values (
    new.user_id,
    'login',
    'auth.sessions',
    new.id,
    jsonb_build_object(
      'user_id', new.user_id,
      'created_at', new.created_at
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for session auditing
drop trigger if exists on_auth_session_created on auth.sessions;
create trigger on_auth_session_created
  after insert on auth.sessions
  for each row
  execute function auth.handle_new_session();

-- Add user deletion cleanup
create or replace function auth.handle_user_deletion()
returns trigger as $$
begin
  -- Clean up user data
  delete from public.profiles where id = old.id;
  
  -- Log deletion
  insert into public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data
  ) values (
    old.id,
    'delete',
    'auth.users',
    old.id,
    jsonb_build_object(
      'email', old.email,
      'deleted_at', now()
    )
  );
  return old;
end;
$$ language plpgsql security definer;

-- Create trigger for user deletion
drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  before delete on auth.users
  for each row
  execute function auth.handle_user_deletion();

-- Add rate limiting for auth operations
create table if not exists auth.rate_limits (
  ip_address inet primary key,
  attempt_count int default 1,
  last_attempt_at timestamptz default now()
);

create or replace function auth.check_rate_limit()
returns trigger as $$
declare
  max_attempts int := 5;
  window_minutes int := 15;
  current_ip inet;
begin
  current_ip := inet_client_addr();
  
  -- Clean up old entries
  delete from auth.rate_limits
  where last_attempt_at < now() - (window_minutes || ' minutes')::interval;
  
  -- Update or insert rate limit record
  insert into auth.rate_limits (ip_address, attempt_count, last_attempt_at)
  values (current_ip, 1, now())
  on conflict (ip_address) do update
  set attempt_count = auth.rate_limits.attempt_count + 1,
      last_attempt_at = now()
  where auth.rate_limits.ip_address = current_ip;
  
  -- Check if rate limit exceeded
  if (select attempt_count from auth.rate_limits where ip_address = current_ip) > max_attempts then
    raise exception 'Rate limit exceeded. Please try again later.';
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for rate limiting
drop trigger if exists check_auth_rate_limit on auth.users;
create trigger check_auth_rate_limit
  before insert on auth.users
  for each row
  execute function auth.check_rate_limit();