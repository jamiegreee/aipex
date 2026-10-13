-- Apply to the dedicated AIPEX database before deploying revised course checks.
-- Constant default labels existing and old-client writes without changing
-- learner responses, scores or completion. Table grants and RLS stay in force.
begin;
set local lock_timeout = '5s';
alter table public.lesson_progress
  add column quiz_revision text not null default '2026-10-13-initial';
commit;
