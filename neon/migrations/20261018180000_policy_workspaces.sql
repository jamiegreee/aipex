-- Additive migration for the dedicated AIPEX Learning database only.
begin;
create table public.policy_workspaces (
  user_id uuid not null references neon_auth."user"(id) on delete cascade,
  id uuid not null,
  tool_slug text not null check (tool_slug in ('assess-evidence', 'compare-options', 'plan-oversight')),
  document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 220000),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.policy_workspaces enable row level security;
revoke all on public.policy_workspaces from public, anonymous;
grant select, insert, update, delete on public.policy_workspaces to authenticated;
create policy workspaces_own on public.policy_workspaces for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create trigger policy_workspaces_updated before update on public.policy_workspaces
for each row execute function public.set_progress_updated_at();
notify pgrst, 'reload schema';
commit;
