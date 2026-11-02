export type ProfileNameResult = { name: string } | { error: string };

export function parseProfileName(value: unknown): ProfileNameResult {
  if (typeof value !== "string") return { error: "Enter your name." };
  // A display name is a single line; invisible or directional formatting can
  // otherwise disguise what was saved when it is shown elsewhere in the site.
  if (/[\p{Cc}\p{Cf}\p{Cs}\p{Zl}\p{Zp}]|\p{Default_Ignorable_Code_Point}/u.test(value))
    return { error: "Enter your name without line breaks or hidden characters." };
  const name = value.normalize("NFC").trim();
  if (!name || Array.from(name).length > 80)
    return { error: "Enter a name between 1 and 80 characters." };
  return { name };
}
