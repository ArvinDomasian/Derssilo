import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type ClerkUserEvent = {
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    email_addresses?: Array<{ email_address: string }>;
  };
  type: "user.created" | "user.updated" | "user.deleted";
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  let event: ClerkUserEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const clerkId = event.data.id;
  const email = event.data.email_addresses?.[0]?.email_address?.toLowerCase();
  const name = `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim() || null;

  if (event.type === "user.deleted") {
    await prisma.user.deleteMany({ where: { clerkUserId: clerkId } });
    return NextResponse.json({ ok: true });
  }

  if (!email) {
    return NextResponse.json({ error: "No email in Clerk payload" }, { status: 400 });
  }

  await prisma.user.upsert({
    where: { clerkUserId: clerkId },
    update: { email, name },
    create: { clerkUserId: clerkId, email, name, status: "PENDING" }
  });

  return NextResponse.json({ ok: true });
}
