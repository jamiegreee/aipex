-- Deploy application support for both versions before applying this migration.
-- Only future notifications use version two. Existing event snapshots, IDs,
-- delivery state and version-one retries are deliberately left unchanged.
begin;

alter table public.membership_email_outbox
  drop constraint membership_email_outbox_template_version_check,
  add constraint membership_email_outbox_template_version_check
    check (template_version in (1, 2)),
  alter column template_version set default 2;

notify pgrst, 'reload schema';
commit;
