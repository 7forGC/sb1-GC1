-- Create chat tables
create table public.conversations (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid default extensions.uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  attachment jsonb,
  is_read boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add RLS policies
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- Conversation policies
create policy "Users can view conversations they're part of"
  on public.conversations for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = id
      and user_id = auth.uid()
    )
  );

create policy "Users can create conversations"
  on public.conversations for insert
  with check (true);

-- Conversation participants policies
create policy "Users can view conversation participants"
  on public.conversation_participants for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Users can add participants"
  on public.conversation_participants for insert
  with check (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
      and user_id = auth.uid()
    ) or
    not exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
    )
  );

-- Message policies
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Users can send messages to their conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id
      and user_id = auth.uid()
    )
  );

-- Create function to update conversation updated_at
create or replace function public.handle_conversation_update()
returns trigger as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for conversation update
create trigger on_message_sent
  after insert on public.messages
  for each row
  execute function public.handle_conversation_update();

-- Create indexes for better performance
create index idx_conversation_participants_user_id
  on public.conversation_participants(user_id);

create index idx_messages_conversation_id
  on public.messages(conversation_id);

create index idx_messages_sender_id
  on public.messages(sender_id);

create index idx_messages_created_at
  on public.messages(created_at desc);