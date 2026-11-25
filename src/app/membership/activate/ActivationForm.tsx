"use client";

import { useActionState } from "react";
import { activateMembership } from "@/app/membership/actions";

export default function ActivationForm() {
  const [state, action, pending] = useActionState(activateMembership, {});

  return (
    <form action={action} className="auth-form">
      {state.error && <p className="form-alert" role="alert">{state.error}</p>}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Activating…" : "Activate membership"}
      </button>
    </form>
  );
}
