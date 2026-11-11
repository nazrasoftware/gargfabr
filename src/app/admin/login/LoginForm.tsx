"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Field } from "@/components/checkout/fields";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-8 space-y-4">
      <Field name="password" type="password" label="Password" required autoComplete="current-password" autoFocus />
      {state?.error && (
        <p className="rounded-2xl bg-madder/10 px-4 py-3 text-sm text-madder-deep" role="alert">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="h-14 w-full rounded-full bg-indigo font-medium text-cotton transition hover:bg-indigo-deep disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
