-- Set the search path explicitly
alter database postgres set search_path to public, extensions;

-- Move extensions to their own schema
create schema if not exists extensions;

-- Ensure extensions are created in the extensions schema
create extension if not exists "uuid-ossp" schema extensions;
create extension if not exists "citext" schema extensions;

-- Grant usage on extensions schema to public
grant usage on schema extensions to public;

-- Ensure public schema exists and is accessible
create schema if not exists public;
grant usage on schema public to public;
grant create on schema public to public;

-- Set default privileges for public schema
alter default privileges in schema public grant all on tables to public;
alter default privileges in schema public grant all on functions to public;
alter default privileges in schema public grant all on sequences to public;

-- Ensure RLS is enabled by default
alter database postgres set row_security = on;

-- Create a function to automatically enable RLS on new tables
create or replace function public.enable_rls_on_new_table()
returns event_trigger
language plpgsql
security definer
as $$
declare
  r record;
begin
  for r in select * from pg_event_trigger_ddl_commands() where command_tag = 'CREATE TABLE'
  loop
    execute format('alter table %s enable row level security', r.object_identity);
  end loop;
end;
$$;

-- Create an event trigger for the RLS function
drop event trigger if exists enable_rls_trigger;
create event trigger enable_rls_trigger
  on ddl_command_end
  when tag in ('CREATE TABLE')
  execute function public.enable_rls_on_new_table();