import Link from "next/link";
import {
  CreditCard,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import {
  fetchCustomerLoans,
  fetchCustomerNotifications,
  fetchDashboardSummary,
} from "@/lib/customerApi";

function formatINR(value: number | null | undefined) {
  const num = Number(value || 0);
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

export default async function CustomerDashboardPage() {
  const [summaryRes, loansRes, notifRes] = await Promise.all([
    fetchDashboardSummary(),
    fetchCustomerLoans(),
    fetchCustomerNotifications(),
  ]);

  const summary = summaryRes.data;
  const loans = loansRes.loans;
  const notifications = notifRes.notifications;

  const userName = summary?.user?.full_name || "Borrower";
  const mode = summary?.mode || (loans.length > 0 ? "ACTIVE" : "ACQUISITION");
  const activeLoan = summary?.loan;
  const nextEmi = summary?.next_emi;
  const repaymentSummary = summary?.repayment_summary;
  const creditScore = summary?.credit_score_preview?.score;
  const creditBand = summary?.credit_score_preview?.band;

  const outstanding =
    repaymentSummary?.outstanding_balance ??
    loans
      .filter((l) => ["DISBURSED", "ACTIVE", "OVERDUE"].includes((l.status || "").toUpperCase()))
      .reduce((sum, l) => sum + Number(l.remaining || 0), 0);

  const totalSanctioned =
    activeLoan?.sanctioned_amount ??
    activeLoan?.approved_amount ??
    loans.reduce((sum, l) => sum + Number(l.approved_amount || l.loan_amount || 0), 0);

  const checkoutHref =
    activeLoan?.id && nextEmi?.amount
      ? `/checkout?loan_id=${encodeURIComponent(activeLoan.id)}&amount=${encodeURIComponent(
          String(nextEmi.amount)
        )}&type=emi`
      : activeLoan?.id
      ? `/checkout?loan_id=${encodeURIComponent(activeLoan.id)}`
      : "/checkout";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}</h1>
          <p className="text-muted-foreground mt-1">
            {mode === "OVERDUE"
              ? "Your EMI is overdue — clear it now to avoid late fees and protect your credit score."
              : mode === "APPLICATION_IN_PROGRESS"
              ? "Your loan application is currently in progress."
              : "Here is a live summary of your active credit lines and repayments."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {nextEmi?.amount ? (
            <Link
              href={checkoutHref}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all flex items-center gap-2 text-sm"
            >
              Pay EMI ({formatINR(nextEmi.amount)})
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/apply"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all flex items-center gap-2 text-sm"
            >
              Apply for New Loan
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {!summaryRes.ok && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{summaryRes.error || "Unable to fetch latest dashboard summary."}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Outstanding Balance</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">{formatINR(outstanding)}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {totalSanctioned > 0
                ? `Total sanctioned across portfolio: ${formatINR(totalSanctioned)}`
                : "No active balance currently"}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Next EMI Due</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">
              {nextEmi?.amount ? formatINR(nextEmi.amount) : "No EMI Due"}
            </h2>
            <div className="flex items-center justify-between mt-1 gap-2">
              <p className="text-xs text-muted-foreground">
                {nextEmi?.due_date ? `Due on ${nextEmi.due_date}` : "No scheduled upcoming installment"}
              </p>
              {nextEmi?.amount && (
                <Link href={checkoutHref} className="text-xs font-semibold text-primary hover:underline">
                  Pay Now
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {creditScore ? "Credit Score Snapshot" : "Application Status"}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {creditScore ? (
              <>
                <h2 className="text-3xl font-bold">{creditScore}</h2>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Band: {creditBand || "Verified"}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">
                  {activeLoan?.status ? activeLoan.status.replace(/_/g, " ") : "Ready to Apply"}
                </h2>
                <Link href="/apply/status" className="text-xs font-semibold text-primary hover:underline mt-1 inline-block">
                  Track status →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Your Loans</h3>
            <Link href="/loans" className="text-sm font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {loans.length === 0 ? (
            <div className="p-8 rounded-xl bg-muted/30 border border-border/60 text-center space-y-3">
              <Wallet className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="font-semibold">No loans yet</p>
              <p className="text-xs text-muted-foreground">
                Start a 100% digital application in under 3 minutes.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Apply Now
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.slice(0, 4).map((loan) => {
                const statusLabel = (loan.status || "PENDING").replace(/_/g, " ");
                const isActive = ["DISBURSED", "ACTIVE", "OVERDUE"].includes(
                  (loan.status || "").toUpperCase()
                );
                return (
                  <div
                    key={loan.id}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{loan.title || "Personal Loan"}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ID: {loan.id.slice(0, 8).toUpperCase()} • {loan.tenure_months} months @ {loan.interest_rate}% p.a.
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {formatINR(loan.approved_amount || loan.loan_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          EMI: {formatINR(loan.emi_amount)}/mo
                        </p>
                      </div>
                      <Link
                        href={
                          isActive
                            ? `/checkout?loan_id=${encodeURIComponent(loan.id)}&amount=${encodeURIComponent(
                                String(loan.emi_amount)
                              )}&type=emi`
                            : `/apply/status?loan_id=${encodeURIComponent(loan.id)}`
                        }
                        className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition"
                      >
                        {isActive ? "Pay EMI" : "Track"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Alerts</h3>
            <Link href="/notifications" className="text-xs font-semibold text-primary hover:underline">
              See All
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent alerts or reminders.</p>
          ) : (
            <div className="space-y-4">
              {notifications.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.is_read ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
