import { UsersTable } from "@/components/users/UsersTable";
import { fetchApi } from "@/lib/apiClient";

export default async function UsersPage() {
  const response = await fetchApi("/admin/users").catch(() => []);
  const users = Array.isArray(response) ? response : response?.data || [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
          <p className="text-muted-foreground">
            Manage all registered users, view profiles, export records, and verify KYC.
          </p>
        </div>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
