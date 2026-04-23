import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";

function orderedPair(a: string, b: string) {
  return a < b ? [a, b] : [b, a];
}

export async function POST(req: NextRequest) {
  try {
    const sender = await requireDbUser();
    const formData = await req.formData();
    const targetEmail = String(formData.get("targetEmail") ?? "").trim().toLowerCase();
    const body = String(formData.get("body") ?? "").trim();

    if (!targetEmail || !body) {
      return NextResponse.json({ error: "targetEmail and body are required" }, { status: 400 });
    }

    const recipient = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const [aId, bId] = orderedPair(sender.id, recipient.id);
    const conversation = await prisma.conversation.upsert({
      where: { participantAId_participantBId: { participantAId: aId, participantBId: bId } },
      update: {},
      create: { participantAId: aId, participantBId: bId }
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: sender.id,
        body
      }
    });

    return NextResponse.redirect(new URL("/messages", req.url));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
