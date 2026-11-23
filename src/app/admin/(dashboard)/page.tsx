import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { TrendCharts } from "@/components/dashboard/TrendCharts";
import { fetchApi } from "@/lib/apiClient";

export default async function AdminDashboardPage() {
  const [statsResponse, analyticsResponse] = await Promise.all([
    fetchApi("/admin/stats").catch(() => ({ data: null })),
    fetchApi("/admin/analytics").catch(() => ({ data: null })),
  ]);

  const stats = statsResponse?.data || statsResponse || null;
  const trends = analyticsResponse?.data?.monthly_trends || analyticsResponse?.monthly_trends || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Platform Overview</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time applications, credit assessments, loan disbursements, and recovery metrics.
        </p>
      </div>

      <MetricsCards initialData={stats} />
      <TrendCharts initialTrends={trends} />
    </div>
  );
}
