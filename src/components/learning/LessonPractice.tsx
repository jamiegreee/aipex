"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { wordCount } from "@/lib/courses";
type Feedback = { correct: boolean; answer: number; explanation: string };
type Props = {
  course: string;
  lesson: string;
  exercise: string;
  rubric: string[];
  minimum: number;
  questions: { prompt: string; options: string[] }[];
  savedResponse: string;
  savedAnswers: number[];
  initiallyComplete: boolean;
};
export default function LessonPractice(props: Props) {
  const [response, setResponse] = useState(props.savedResponse);
  const [answers, setAnswers] = useState(
    props.questions.map((_, i) => props.savedAnswers[i] ?? -1),
  );
  const [reviewed, setReviewed] = useState(props.initiallyComplete);
  const [completed, setCompleted] = useState(props.initiallyComplete);
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<Feedback[] | null>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    const guard = (e: MouseEvent) => {
      if (!dirty || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const link =
        e.target instanceof Element
          ? e.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download"))
        return;
      const destination = new URL(link.href, window.location.href);
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      )
        return;
      if (
        !window.confirm(
          "You have unsaved changes. Leave this lesson without saving? Choose Cancel, then Save draft to keep your work.",
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", guard, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", guard, true);
    };
  }, [dirty]);
  const save = async (action: "save" | "complete") => {
    setPending(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          course: props.course,
          lesson: props.lesson,
          response,
          answers,
          reviewed,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Could not save your work.");
      setDirty(false);
      setMessage(result.message);
      if (result.feedback) setFeedback(result.feedback);
      setCompleted(result.completed);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Connection failed. Keep this page open and try again.",
      );
    } finally {
      setPending(false);
      setTimeout(() => status.current?.focus(), 0);
    }
  };
  return (
    <section className="practice" aria-labelledby="practice-heading">
      <p className="label">Put it into practice</p>
      <h2 id="practice-heading">Your turn.</h2>
      <p>{props.exercise}</p>
      <p className="small-copy">
        Use the fictional case or anonymised examples. Don’t enter confidential
        information or personal details about other people.
      </p>
      <label className="response-label" htmlFor="exercise-response">
        Your working answer
      </label>
      <textarea
        id="exercise-response"
        value={response}
        maxLength={50000}
        rows={12}
        disabled={pending}
        onChange={(e) => {
          setResponse(e.target.value);
          setDirty(true);
        }}
        placeholder="Work through the decision in your own words…"
      />
      <div className="draft-bar">
        <span>
          {wordCount(response)} words · minimum {props.minimum} to complete
        </span>
        <span>
          {dirty
            ? "Unsaved changes"
            : props.savedResponse || message
              ? "Saved draft"
              : "Not saved yet"}
        </span>
      </div>
      <button
        type="button"
        className="button button-outline"
        disabled={pending}
        onClick={() => save("save")}
      >
        {pending ? "Saving…" : "Save draft"}
      </button>
      <div className="self-review">
        <h3>Review your answer</h3>
        <p>
          Use these criteria and the worked example below. Written exercises are
          self-assessed.
        </p>
        <ul>
          {props.rubric.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <label className="check-label">
          <input
            type="checkbox"
            checked={reviewed}
            disabled={pending}
            onChange={(e) => setReviewed(e.target.checked)}
          />
          I’ve reviewed my answer against the rubric.
        </label>
      </div>
      <div className="knowledge-check">
        <p className="label">Check your understanding</p>
        <h3>A couple of questions.</h3>
        <p>
          Get both right to complete the lesson. You can retry and use the
          explanations to learn.
        </p>
        {props.questions.map((q, i) => (
          <fieldset key={q.prompt}>
            <legend>
              {i + 1}. {q.prompt}
            </legend>
            {q.options.map((option, j) => (
              <label
                key={option}
                className={`quiz-option ${answers[i] === j ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${i}`}
                  value={j}
                  checked={answers[i] === j}
                  disabled={pending}
                  onChange={() => {
                    setAnswers((values) =>
                      values.map((v, n) => (n === i ? j : v)),
                    );
                    setFeedback(null);
                    setDirty(true);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
            {feedback?.[i] && (
              <p
                className={`quiz-feedback ${feedback[i].correct ? "correct" : "incorrect"}`}
              >
                {feedback[i].correct
                  ? "✓ Correct. "
                  : `Try again. The answer is: ${q.options[feedback[i].answer]}. `}
                {feedback[i].explanation}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div className="completion-actions">
        <button
          type="button"
          className="button"
          disabled={pending}
          onClick={() => save("complete")}
        >
          {pending
            ? "Checking & saving…"
            : completed
              ? "Save & recheck"
              : "Check answers & complete"}
          <span aria-hidden="true">→</span>
        </button>
        {completed && <span className="complete-label">✓ Lesson complete</span>}
      </div>
      <p
        ref={status}
        tabIndex={-1}
        className={error ? "form-alert" : "form-success"}
        role={error ? "alert" : "status"}
      >
        {error || message}
      </p>
    </section>
  );
}
