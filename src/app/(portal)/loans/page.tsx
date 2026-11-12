import { fetchCustomerLoans, fetchCustomerMe } from "@/lib/customerApi";
import { LoansListView } from "@/components/portal/LoansListView";
import { AlertCircle } from "lucide-react";

export default async function MyLoansPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const [loansRes, meRes] = await Promise.all([
    fetchCustomerLoans(),
    fetchCustomerMe(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!loansRes.ok && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{loansRes.error || "Unable to fetch loans from server."}</span>
        </div>
      )}
      <LoansListView
        loans={loansRes.loans}
        user={meRes.data}
        initialQuery={params?.q || ""}
      />
    </div>
  );
}
