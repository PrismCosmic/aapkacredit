import { ApplicationQueueTable } from "@/components/applications/ApplicationQueueTable";
import { fetchApi } from "@/lib/apiClient";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const response = await fetchApi("/admin/loans").catch(() => []);
  const applications = Array.isArray(response) ? response : response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Application Queue</h2>
          <p className="text-muted-foreground">
            Review and manage all incoming loan applications.
          </p>
        </div>
      </div>

      <ApplicationQueueTable
        initialApplications={applications}
        initialQuery={params?.q || ""}
      />
    </div>
  );
}
