import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnswerForm } from "./AnswerForm";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) notFound();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-lg mx-auto">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            question.category === "TECHNICAL"
              ? "bg-indigo-900 text-indigo-200"
              : "bg-emerald-900 text-emerald-200"
          }`}
        >
          {question.category === "TECHNICAL" ? "Technical" : "Social"} · {question.points} pts
        </span>
        <h1 className="text-xl font-semibold mt-3 mb-6">{question.text}</h1>
        <AnswerForm questionId={question.id} />
      </div>
    </main>
  );
}