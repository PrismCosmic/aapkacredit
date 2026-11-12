import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Wallet, IndianRupee, TrendingUp, ShieldCheck, Coins } from "lucide-react";

export function MetricsCards({ initialData }: { initialData?: any }) {
  const pendingApplications =
    initialData?.pending_approvals !== undefined && initialData?.pending_approvals !== null
      ? Number(initialData.pending_approvals)
      : 0;

  const metrics = [
    {
      title: "Total Registered Users",
      value: (initialData?.total_users ?? 0).toLocaleString(),
      subtitle: "Verified customer accounts",
      icon: Users,
    },
    {
      title: "Paid Bureau Checks",
      value: (initialData?.total_credit_checks ?? 0).toLocaleString(),
      subtitle: "Completed CIBIL/CRIF pulls",
      icon: ShieldCheck,
    },
    {
      title: "Assessment Fee Revenue",
      value: `₹${((initialData?.assessment_fee_revenue ?? 0) / 1000).toFixed(1)}k`,
      subtitle: "Captured processing & fee revenue",
      icon: Coins,
    },
    {
      title: "Active Credit Lines",
      value: (initialData?.active_loans ?? 0).toLocaleString(),
      subtitle: "Disbursed & active loan accounts",
      icon: Wallet,
    },
    {
      title: "Pending Applications",
      value: pendingApplications.toLocaleString(),
      subtitle: "Awaiting underwriting / KYC review",
      icon: FileText,
    },
    {
      title: "Amount Disbursed",
      value: `₹${((initialData?.total_disbursed_amount ?? 0) / 100000).toFixed(2)} L`,
      subtitle: "Cumulative principal disbursed",
      icon: IndianRupee,
    },
    {
      title: "Collection Efficiency",
      value: `${Number(initialData?.collection_efficiency_pct ?? 0).toFixed(1)}%`,
      subtitle: "On-time EMI recovery ratio",
      icon: CheckCircle,
    },
    {
      title: "Bureau Approval Rate",
      value: `${Number(initialData?.bureau_approval_rate_pct ?? 0).toFixed(1)}%`,
      subtitle: "Applications passing risk floor",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card/50 backdrop-blur border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{metric.value}</div>
            <p className="text-xs mt-1 text-muted-foreground">{metric.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
