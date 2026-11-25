-- Deploy the application with frozen versions 1–4 and green version 5 first.
-- Defaults affect only future notifications, including decisions on existing
-- applications. Do not rewrite sent, pending or leased event snapshots.
-- This migration changes no delivery configuration, records or permissions.
begin;

alter table public.membership_email_outbox
  drop constraint membership_email_outbox_template_version_check,
  add constraint membership_email_outbox_template_version_check
    check (template_version in (1, 2, 3, 5)),
  alter column template_version set default 5;

alter table public.membership_request_emails
  drop constraint membership_request_emails_template_version_check,
  add constraint membership_request_emails_template_version_check
    check (template_version in (4, 5)),
  alter column template_version set default 5;

notify pgrst, 'reload schema';
commit;
