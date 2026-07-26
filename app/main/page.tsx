//the bingo board
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export default async function MainPage() {
  const profile = await getCurrentProfile();
  const questions = await prisma.question.findMany({
    orderBy: { boardIndex: "asc" },
  });

  // the current user's own submissions, keyed by question
  const mySubs = profile
    ? await prisma.submission.findMany({
        where: { userId: profile.id },
        select: { questionId: true, status: true },
      })
    : [];
  const statusByQuestion = new Map(mySubs.map((s) => [s.questionId, s.status]));

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Jumbingo</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/leaderboard"
              className="text-sm text-gray-300 hover:text-white rounded-md border border-gray-700 px-3 py-1"
            >
              Leaderboard
            </Link>
            <UserMenu name={profile?.name ?? ""} isAdmin={profile?.role === "ADMIN"} />
          </div>
        </header>

        <div className="grid grid-cols-4 gap-3">
                  
        {questions.map((q) => {
          const myStatus = statusByQuestion.get(q.id);
          const answered = Boolean(myStatus);

          const className = `rounded-lg border p-4 flex flex-col gap-2 min-h-32 ${
            answered
              ? "border-gray-800 bg-gray-900/50 opacity-60 cursor-not-allowed"
              : "border-gray-700 bg-gray-900 hover:border-gray-400 transition"
          }`;

          const inner = (
            <>
              <span
                className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                  q.category === "TECHNICAL"
                    ? "bg-indigo-900 text-indigo-200"
                    : "bg-emerald-900 text-emerald-200"
                }`}
              >
                {q.category === "TECHNICAL" ? "Technical" : "Social"}
              </span>

              <p className="text-sm">{q.text}</p>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-400">{q.points} pts</span>
                {myStatus && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      myStatus === "APPROVED"
                        ? "bg-emerald-900 text-emerald-200"
                        : myStatus === "PENDING"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {myStatus === "APPROVED"
                      ? "Approved"
                      : myStatus === "PENDING"
                      ? "Pending"
                      : "Declined"}
                  </span>
                )}
              </div>
            </>
          );

          return answered ? (
            <div key={q.id} className={className}>{inner}</div>
          ) : (
            <Link key={q.id} href={`/question/${q.id}`} className={className}>{inner}</Link>
          );
        })}
        </div>
      </div>
    </main>
  );
}