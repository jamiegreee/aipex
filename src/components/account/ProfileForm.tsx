"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ProfileState } from "@/app/account/actions";

export default function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const [name, setName] = useState(initialName);
  const [state, action, pending] = useActionState(
    async (previous: ProfileState, form: FormData) => {
      const result = await updateProfile(previous, form);
      if (result.name !== undefined) setName(result.name);
      return result;
    },
    {},
  );

  return (
    <form action={action} className="auth-form account-profile-form">
      <label htmlFor="account-name">
        Display name
        <input
          id="account-name"
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={pending}
          aria-describedby="account-name-hint"
        />
        <span id="account-name-hint">The name shown on your AIPEX account.</span>
      </label>
      <dl className="account-email">
        <dt>Email address</dt>
        <dd>{email}</dd>
      </dl>
      {state.error && <p className="form-alert" role="alert">{state.error}</p>}
      {state.message && <p className="form-success" role="status">{state.message}</p>}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
