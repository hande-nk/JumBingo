// prisma/seed.ts
// Populates the database with test data: teams, a 4x4 board of questions,
// users, and a few submissions. Safe to re-run: it clears existing rows first.

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import type { QuestionCategory } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  if (process.env.CONFIRM_SEED !== "yes") {
    throw new Error(
      "Refusing to run the destructive seed. Run with CONFIRM_SEED=yes if you really mean it."
    );
  }
  // Clear existing data. Order matters: delete children before parents,
  // because of the foreign keys (a submission points at a user and a question).
  await prisma.submission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.question.deleteMany();
  await prisma.team.deleteMany();
  // Teams
  const byteClub = await prisma.team.create({
    data: { id: "team-byte", name: "Byte club" },
  });
  const nullPointers = await prisma.team.create({
    data: { id: "team-null", name: "Null pointers" },
  });
  await prisma.team.create({
    data: { id: "team-stack", name: "Stack overflowers" },
  });

  // Questions: a 4x4 board, boardIndex 0-15, mixed Technical/Social.
  const questions: {
    text: string;
    category: QuestionCategory;
    points: number;
    boardIndex: number;
  }[] = [
    { text: "Name three HTTP methods and what each does in a CRUD app.", category: "TECHNICAL", points: 20, boardIndex: 0 },
    { text: "Find someone who has been to another country.", category: "SOCIAL", points: 10, boardIndex: 1 },
    { text: "What does CRUD stand for?", category: "TECHNICAL", points: 20, boardIndex: 2 },
    { text: "Take a selfie with a tech lead.", category: "SOCIAL", points: 15, boardIndex: 3 },
    { text: "Explain what an ORM does.", category: "TECHNICAL", points: 25, boardIndex: 4 },
    { text: "Learn a fun fact about another member.", category: "SOCIAL", points: 10, boardIndex: 5 },
    { text: "What port does a Next.js dev server use by default?", category: "TECHNICAL", points: 20, boardIndex: 6 },
    { text: "High-five five different people.", category: "SOCIAL", points: 10, boardIndex: 7 },
    { text: "What is a primary key?", category: "TECHNICAL", points: 15, boardIndex: 8 },
    { text: "Find someone with your major.", category: "SOCIAL", points: 10, boardIndex: 9 },
    { text: "Explain the difference between let and const.", category: "TECHNICAL", points: 15, boardIndex: 10 },
    { text: "Introduce yourself to an admin.", category: "SOCIAL", points: 10, boardIndex: 11 },
    { text: "What is an API route in Next.js?", category: "TECHNICAL", points: 20, boardIndex: 12 },
    { text: "Swap contact info with a new person.", category: "SOCIAL", points: 10, boardIndex: 13 },
    { text: "What does SQL stand for?", category: "TECHNICAL", points: 15, boardIndex: 14 },
    { text: "Name everyone on your team.", category: "SOCIAL", points: 10, boardIndex: 15 },
  ];

  await prisma.question.createMany({
    data: questions.map((q, i) => ({ id: `q${i}`, ...q })),
  });

  // Users: one admin, members on teams, and two unassigned.
  await prisma.user.createMany({
    data: [
      { id: "user-admin", email: "admin@tufts.edu", name: "Admin", role: "ADMIN" },
      { id: "user-naz", email: "naz.kavas@tufts.edu", name: "Naz Kavas", role: "MEMBER", teamId: byteClub.id },
      { id: "user-leo", email: "leo.m@tufts.edu", name: "Leo M", role: "MEMBER", teamId: byteClub.id },
      { id: "user-ana", email: "ana.s@tufts.edu", name: "Ana S", role: "MEMBER", teamId: byteClub.id },
      { id: "user-ava", email: "ava.l@tufts.edu", name: "Ava L", role: "MEMBER", teamId: nullPointers.id },
      { id: "user-omar", email: "omar.d@tufts.edu", name: "Omar D", role: "MEMBER", teamId: nullPointers.id },
      { id: "user-sam", email: "sam.t@tufts.edu", name: "Sam T", role: "MEMBER" },
      { id: "user-priya", email: "priya.r@tufts.edu", name: "Priya R", role: "MEMBER" },
    ],
  });

  // Submissions: a mix of approved (earn points) and pending (await review).
  await prisma.submission.createMany({
    data: [
      { userId: "user-naz", questionId: "q2", answer: "Create, read, update, delete", status: "APPROVED" },
      { userId: "user-naz", questionId: "q4", answer: "It maps objects in code to rows in the database.", status: "APPROVED" },
      { userId: "user-leo", questionId: "q0", answer: "GET reads, POST creates, DELETE removes.", status: "APPROVED" },
      { userId: "user-ava", questionId: "q1", answer: "Maya, she visited Iceland!", status: "PENDING" },
      { userId: "user-omar", questionId: "q7", answer: "Done, high-fived five people.", status: "PENDING" },
    ],
  });

  console.log("Seed complete: teams, questions, users, and submissions created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });