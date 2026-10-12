"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function EnrollButton({
  course,
  destination,
  signedIn,
  enrolled,
}: {
  course: string;
  destination: string;
  signedIn: boolean;
  enrolled: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  if (!signedIn)
    return (
      <Link
        className="button"
        href={`/signup?next=${encodeURIComponent(`/courses/${course}`)}`}
      >
        Create an account to start <span aria-hidden="true">↗</span>
      </Link>
    );
  if (enrolled)
    return (
      <Link className="button" href={destination}>
        Continue learning <span aria-hidden="true">→</span>
      </Link>
    );
  return (
    <div>
      <button
        className="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          try {
            const response = await fetch("/api/learning", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "enroll", course }),
            });
            const result = await response.json();
            if (!response.ok)
              throw new Error(result.error || "We could not enrol you.");
            router.push(destination);
            router.refresh();
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Connection failed. Try again.",
            );
            setPending(false);
          }
        }}
      >
        {pending ? "Enrolling…" : "Enrol free & start"}{" "}
        <span aria-hidden="true">→</span>
      </button>
      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
