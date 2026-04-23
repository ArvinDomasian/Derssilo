import { auth } from "@clerk/nextjs/server";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const { userId } = auth();
  if (!userId) {
    return <p>Please sign in to view messages.</p>;
  }

  let dbUser;
  try {
    dbUser = await requireDbUser();
  } catch {
    return <p>Unable to load user.</p>;
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: dbUser.id }, { participantBId: dbUser.id }]
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      participantA: true,
      participantB: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Messages</h1>
      <form action="/api/messages" method="post" className="space-y-2 rounded border bg-white p-4">
        <h2 className="font-semibold">Start or continue conversation</h2>
        <input name="targetEmail" placeholder="Other user's email" className="w-full rounded border px-3 py-2 text-sm" />
        <textarea name="body" placeholder="Message" className="w-full rounded border px-3 py-2 text-sm" />
        <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white" type="submit">
          Send message
        </button>
      </form>
      <ul className="space-y-3">
        {conversations.map((conversation) => {
          const other =
            conversation.participantAId === dbUser.id ? conversation.participantB : conversation.participantA;
          return (
            <li key={conversation.id} className="rounded border bg-white p-4">
              <p className="font-medium">{other.email}</p>
              <p className="text-sm text-slate-600">{conversation.messages[0]?.body ?? "No messages yet."}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
