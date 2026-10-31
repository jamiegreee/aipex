-- Deploy application support for versions one, two and three, with the private
-- approved-member Slack gateway configured, before applying this migration.
-- Only future notifications use version three. Existing snapshots, event IDs,
-- delivery state and retries deliberately retain their original versions.
begin;

alter table public.membership_email_outbox
  drop constraint membership_email_outbox_template_version_check,
  add constraint membership_email_outbox_template_version_check
    check (template_version in (1, 2, 3)),
  alter column template_version set default 3;

notify pgrst, 'reload schema';
commit;
