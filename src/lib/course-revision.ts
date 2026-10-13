// Saved option indexes only mean something within the question edition that
// produced them. Keep response text and prior completion outside this check.
export function answersForRevision(
  saved: { quiz_revision?: string; quiz_answers: number[] } | undefined,
  revision: string,
): number[] {
  return saved?.quiz_revision === revision ? saved.quiz_answers : [];
}
