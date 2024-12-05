create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamptz default now(),
  operation text not null,
  resource text not null,
  user_id uuid references auth.users(id),
  user_email text not null,
  status text not null check (status in ('success', 'error')),
  details text
);

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Create policy to allow all authenticated users to view audit logs
create policy "Allow authenticated users to view audit logs"
  on public.audit_logs
  for select
  to authenticated
  using (true);

-- Create policy to allow the system to insert audit logs
create policy "Allow system to insert audit logs"
  on public.audit_logs
  for insert
  to authenticated
  with check (true); 