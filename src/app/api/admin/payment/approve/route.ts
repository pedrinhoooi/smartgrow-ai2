import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Schema = z.object({
  paymentId: z.string().min(1),
  approve: z.boolean(),
});

function addPeriod(plan: string) {
  const now = new Date();
  if (plan === "DAILY") now.setDate(now.getDate() + 1);
  else if (plan === "WEEKLY") now.setDate(now.getDate() + 7);
  else if (plan === "MONTHLY") now.setMonth(now.getMonth() + 1);
  else now.setFullYear(now.getFullYear() + 1);
  return now;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const role = (session as any).role as string;
  if (role !== "ADMIN") return NextResponse.json({ error: "Somente admin" }, { status: 403 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const payment = await prisma.payment.findUnique({ where: { id: parsed.data.paymentId } });
  if (!payment) return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });

  if (!parsed.data.approve) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "REJECTED" as any } });
    await prisma.subscription.upsert({
      where: { userId: payment.userId },
      update: { status: "PENDING" as any },
      create: { userId: payment.userId, status: "PENDING" as any },
    });
    return NextResponse.json({ ok: true, status: "REJECTED" });
  }

  const end = addPeriod(payment.plan);

  await prisma.payment.update({ where: { id: payment.id }, data: { status: "APPROVED" as any } });
  await prisma.subscription.upsert({
    where: { userId: payment.userId },
    update: { plan: payment.plan as any, status: "ACTIVE" as any, currentPeriodEnd: end },
    create: { userId: payment.userId, plan: payment.plan as any, status: "ACTIVE" as any, currentPeriodEnd: end },
  });

  return NextResponse.json({ ok: true, status: "APPROVED", currentPeriodEnd: end.toISOString() });
}
