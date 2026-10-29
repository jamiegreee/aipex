"use server";

import { revalidatePath } from "next/cache";
import { authConfigured, createAuth, currentUser } from "@/lib/auth";
import { parseProfileName } from "@/lib/account-profile";

export type ProfileState = {
  error?: string;
  message?: string;
  name?: string;
};

export async function updateProfile(
  _: ProfileState,
  form: FormData,
): Promise<ProfileState> {
  const names = form.getAll("name");
  if (names.length !== 1) return { error: "Enter your name." };
  const parsed = parseProfileName(names[0]);
  if ("error" in parsed) return parsed;
  if (!authConfigured())
    return { error: "Account settings are temporarily unavailable. Please try again shortly." };

  try {
    const user = await currentUser(true);
    if (!user) return { error: "Sign in again to update your profile." };

    // Identity comes only from the verified session. Never forward arbitrary
    // form fields (email, user ID or membership details) to the Auth provider.
    const { error } = await createAuth().updateUser({ name: parsed.name });
    if (error)
      return {
        error: error.status === 401 || error.status === 403
          ? "Sign in again to update your profile."
          : "We couldn’t save your profile. Please try again shortly.",
      };
  } catch {
    return { error: "We couldn’t confirm your profile update. Refresh the page before trying again." };
  }

  revalidatePath("/account");
  return { message: "Your profile has been updated.", name: parsed.name };
}
