import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Schema = z.object({
  userId: z.string().min(1),
  approve: z.boolean(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const role = (session as any).role as string;
  if (role !== "ADMIN") return NextResponse.json({ error: "Somente admin" }, { status: 403 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { proofStatus: (parsed.data.approve ? "APPROVED" : "REJECTED") as any },
  });

  return NextResponse.json({ ok: true });
}
