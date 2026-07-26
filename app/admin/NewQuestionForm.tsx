"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewQuestionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: data.get("text"),
        category: data.get("category"),
        points: Number(data.get("points")),
      }),
    });

    if (res.ok) {
      form.reset();
      setSuccess(true);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not create the question.");
    }
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4"
    >
      <input
        name="text"
        required
        placeholder="Question text"
        className="rounded-md bg-gray-950 border border-gray-700 px-3 py-2 text-sm"
      />
      <div className="flex gap-3">
        <select
          name="category"
          className="rounded-md bg-gray-950 border border-gray-700 px-3 py-2 text-sm flex-1"
        >
          <option value="TECHNICAL">Technical</option>
          <option value="SOCIAL">Social</option>
        </select>
        <input
          name="points"
          type="number"
          min={1}
          required
          placeholder="Points"
          className="rounded-md bg-gray-950 border border-gray-700 px-3 py-2 text-sm w-28"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-400">Question added.</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-emerald-500 text-black text-sm font-medium py-2 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add question"}
      </button>
    </form>
  );
}