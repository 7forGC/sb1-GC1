-- First, check if the type exists and drop it conditionally
do $$ 
begin
    -- Only drop the type if it exists and is not being used
    if exists (
        select 1 from pg_type 
        where typname = 'user_role' 
        and not exists (
            select 1 from pg_class c
            join pg_attribute a on a.attrelid = c.oid
            where a.atttypid = pg_type.oid
        )
    ) then
        drop type user_role;
    end if;
end $$;

-- Now create or replace the enum type
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type user_role as enum ('user', 'admin');
    end if;
end $$;

-- Ensure RLS policies are up to date
alter table if exists public.profiles enable row level security;

-- Recreate or update policies if needed
do $$ 
begin
    if not exists (
        select 1 from pg_policies 
        where tablename = 'profiles' 
        and policyname = 'Public profiles are viewable by everyone'
    ) then
        create policy "Public profiles are viewable by everyone"
            on public.profiles for select
            using (true);
    end if;
end $$;