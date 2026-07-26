//Server Component, admin-guarded, shows the pending queue
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { ReviewButtons } from "./ReviewButtons";
import { NewQuestionForm } from "./NewQuestionForm";
import { DeleteQuestionButton } from "./DeleteQuestionButton";

export default async function AdminPage() {
    await requireAdmin(); // non-admins get redirected before any render

    const pending = await prisma.submission.findMany({
        where: { status: "PENDING" },
        include: {
        user: { select: { name: true, team: { select: { name: true } } } },
        question: { select: { text: true, points: true } },
        },
        orderBy: { createdAt: "asc" },
    });
    const questions = await prisma.question.findMany({
        orderBy: { boardIndex: "asc" },
        include: {
            submissions: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "asc" },
            },
        },
    });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Answer review</h1>

        {pending.length === 0 ? (
          <p className="text-gray-400">No pending answers. All caught up.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {pending.map((s) => (
              <li key={s.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <p className="text-xs text-gray-400 mb-1">
                  {s.question.text} · {s.question.points} pts
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">{s.user.name}</span>
                  {s.user.team?.name ? ` (${s.user.team.name})` : ""}
                </p>
                <p className="text-sm text-gray-200 mb-3">&ldquo;{s.answer}&rdquo;</p>
                <ReviewButtons submissionId={s.id} />
              </li>
            ))}
          </ul>
        )}

        <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Add a question</h2>
            <NewQuestionForm />
        </section>

        <section className="mb-8">
    <h2 className="text-lg font-semibold mb-3">All questions</h2>
        <ul className="flex flex-col gap-3">
            {questions.map((q) => (
            <li key={q.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400">
                    #{q.boardIndex} · {q.category === "TECHNICAL" ? "Technical" : "Social"} · {q.points} pts
                    </p>
                    <p className="text-sm">{q.text}</p>
                </div>
                <DeleteQuestionButton id={q.id} />
                </div>

                {q.submissions.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1 border-t border-gray-800 pt-2">
                    {q.submissions.map((s) => (
                    <li key={s.id} className="text-xs flex items-center justify-between gap-3">
                        <span className="text-gray-300">
                        {s.user.name}: &ldquo;{s.answer}&rdquo;
                        </span>
                        <span
                        className={
                            s.status === "APPROVED"
                            ? "text-emerald-400"
                            : s.status === "PENDING"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                        >
                        {s.status}
                        </span>
                    </li>
                    ))}
                </ul>
                )}
            </li>
            ))}
        </ul>
        </section>
      </div>
    </main>
  );
}