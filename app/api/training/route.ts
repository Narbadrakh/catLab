import { prisma } from "@/app/_lib/prisma";

export async function GET() {
  const runs = await prisma.trainingRun.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(runs);
}

export async function POST(request: Request) {
  const { rounds, accuracy } = await request.json();
  const run = await prisma.trainingRun.create({
    data: { rounds, accuracy },
  });
  return Response.json(run);
}