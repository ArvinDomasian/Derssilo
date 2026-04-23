import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminUsersPage() {
  try {
    await requireAdmin();
  } catch {
    return <p>Admin access only.</p>;
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin: Users</h1>
      <div className="rounded border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.name ?? "-"}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.status}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <form action="/api/admin/users" method="post">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <button type="submit" className="rounded border px-2 py-1 text-xs">
                        Approve
                      </button>
                    </form>
                    <form action="/api/admin/users" method="post">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="status" value="DECLINED" />
                      <button type="submit" className="rounded border px-2 py-1 text-xs">
                        Decline
                      </button>
                    </form>
                    <form action="/api/admin/users" method="post">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="role" value={user.role === "ADMIN" ? "USER" : "ADMIN"} />
                      <button type="submit" className="rounded border px-2 py-1 text-xs">
                        Make {user.role === "ADMIN" ? "User" : "Admin"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
