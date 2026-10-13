-- Dedicated AIPEX database only. Enable Neon Auth and Data API first.
-- Account IDs are UUIDs in the inspected managed Neon Auth schema.
begin;

grant usage on schema public to authenticated;
create table public.course_enrollments (
  user_id uuid not null references neon_auth."user"(id) on delete cascade,
  course_slug text not null check (course_slug in ('ai-policy-in-practice', 'governing-ai-in-public-services')),
  created_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);
create table public.lesson_progress (
  user_id uuid not null,
  course_slug text not null,
  lesson_slug text not null check (length(lesson_slug) between 1 and 120),
  response text not null default '' check (length(response) <= 50000),
  quiz_answers jsonb not null default '[]'::jsonb check (jsonb_typeof(quiz_answers) = 'array'),
  quiz_score integer check (quiz_score between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_slug),
  foreign key (user_id, course_slug) references public.course_enrollments(user_id, course_slug) on delete cascade
);
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
revoke all on public.course_enrollments, public.lesson_progress from public, anonymous;
grant select, insert, update on public.course_enrollments, public.lesson_progress to authenticated;
create policy enrollment_read_own on public.course_enrollments for select to authenticated using ((select auth.uid()) = user_id);
create policy enrollment_create_own on public.course_enrollments for insert to authenticated with check ((select auth.uid()) = user_id);
create policy enrollment_update_own on public.course_enrollments for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy progress_read_own on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy progress_create_own on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy progress_update_own on public.lesson_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create function public.set_progress_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_progress_updated_at() from public, anonymous, authenticated;
create trigger lesson_progress_updated before update on public.lesson_progress
for each row execute function public.set_progress_updated_at();

commit;
