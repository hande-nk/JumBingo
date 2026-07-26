//the bingo board
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth-helpers";
import Link from "next/link";

export default async function MainPage() {
  const profile = await getCurrentProfile();
  const questions = await prisma.question.findMany({
    orderBy: { boardIndex: "asc" },
  });

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Jumbingo</h1>
          <span className="text-sm text-gray-400">{profile?.name}</span>
        </header>

        <div className="grid grid-cols-4 gap-3">
            {questions.map((q) => (
                <Link
                    key={q.id}
                    href={`/question/${q.id}`}
                    className="rounded-lg border border-gray-700 bg-gray-900 p-4 flex flex-col gap-2 min-h-32 hover:border-gray-400 transition"
                >
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
                    <span className="text-xs text-gray-400 mt-auto">{q.points} pts</span>
                </Link>
            ))}           
        </div>
      </div>
    </main>
  );
}