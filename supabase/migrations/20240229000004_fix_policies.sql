-- Recreate policies with better security
do $$ 
begin
  -- Drop existing policies
  drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
  drop policy if exists "Users can insert their own profile" on public.profiles;
  drop policy if exists "Users can update own profile" on public.profiles;

  -- Create new policies with stricter controls
  create policy "Profiles are viewable by authenticated users"
    on public.profiles for select
    using (auth.role() = 'authenticated');

  create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

  create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

  -- Add policies for soft delete if needed
  create policy "Users can soft delete own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id and new.deleted_at is not null);
end $$;

-- Add audit logging
create table if not exists public.audit_logs (
  id uuid default extensions.uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  action text not null,
  table_name text not null,
  record_id uuid not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

-- Create audit logging function
create or replace function public.audit_log_changes()
returns trigger as $$
begin
  insert into public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  ) values (
    auth.uid(),
    tg_op,
    tg_table_name::text,
    case
      when tg_op = 'DELETE' then old.id
      else new.id
    end,
    case when tg_op = 'DELETE' then row_to_json(old)::jsonb else null end,
    case when tg_op in ('INSERT', 'UPDATE') then row_to_json(new)::jsonb else null end
  );
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Add audit triggers to important tables
create trigger audit_profiles_changes
  after insert or update or delete on public.profiles
  for each row execute function public.audit_log_changes();

create trigger audit_posts_changes
  after insert or update or delete on public.posts
  for each row execute function public.audit_log_changes();