"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileText, ShieldCheck, X, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";
import type { CustomerLoanSummary, CustomerUser } from "@/lib/customerApi";

interface LoansListViewProps {
  loans: CustomerLoanSummary[];
  user: CustomerUser | null;
  initialQuery?: string;
}

export function LoansListView({ loans, user, initialQuery = "" }: LoansListViewProps) {
  const [search, setSearch] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "IN_PROGRESS" | "CLOSED">("ALL");
  const [modalTitle, setModalTitle] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalKind, setModalKind] = useState<"statement" | "kfs" | "foreclose" | null>(null);
  const [modalLoanId, setModalLoanId] = useState<string>("");

  const filteredLoans = useMemo(() => {
    const q = search.trim().toLowerCase();
    return loans.filter((l) => {
      const upper = (l.status || "").toUpperCase();
      if (statusFilter === "ACTIVE" && !["DISBURSED", "ACTIVE", "OVERDUE"].includes(upper)) {
        return false;
      }
      if (statusFilter === "CLOSED" && !["CLOSED", "REJECTED", "CANCELLED", "COOLING_OFF_CANCELLED"].includes(upper)) {
        return false;
      }
      if (
        statusFilter === "IN_PROGRESS" &&
        ["DISBURSED", "ACTIVE", "OVERDUE", "CLOSED", "REJECTED", "CANCELLED", "COOLING_OFF_CANCELLED"].includes(upper)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        l.id.toLowerCase().includes(q) ||
        (l.title || "").toLowerCase().includes(q) ||
        (l.status || "").toLowerCase().includes(q) ||
        String(l.loan_amount).includes(q)
      );
    });
  }, [loans, search, statusFilter]);

  const openStatementModal = async (loanId: string) => {
    setModalKind("statement");
    setModalLoanId(loanId);
    setModalTitle(`Repayment Schedule & Statement (#${loanId.slice(0, 8).toUpperCase()})`);
    setModalData(null);
    setModalLoading(true);
    try {
      const [schedRes, stmtRes] = await Promise.all([
        fetch(`/api/portal/loans/${encodeURIComponent(loanId)}/schedule`),
        fetch(`/api/portal/loans/${encodeURIComponent(loanId)}/documents/statement`),
      ]);
      const schedJson = await schedRes.json().catch(() => ({}));
      const stmtJson = await stmtRes.json().catch(() => ({}));
      setModalData({
        schedule: schedJson?.data || null,
        statement: stmtJson?.data || null,
      });
    } catch {
      toast.error("Failed to fetch loan statement");
    } finally {
      setModalLoading(false);
    }
  };

  const openKfsModal = async (loanId: string) => {
    setModalKind("kfs");
    setModalLoanId(loanId);
    setModalTitle(`Key Fact Statement (KFS #${loanId.slice(0, 8).toUpperCase()})`);
    setModalData(null);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/portal/loans/${encodeURIComponent(loanId)}/kfs`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        toast.error(json?.message || "Unable to fetch KFS");
      } else {
        setModalData(json?.data || json);
      }
    } catch {
      toast.error("Failed to fetch KFS");
    } finally {
      setModalLoading(false);
    }
  };

  const handleAcceptKfs = async () => {
    if (!modalLoanId) return;
    try {
      const res = await fetch(`/api/portal/loans/${encodeURIComponent(modalLoanId)}/kfs/accept`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        toast.error(json?.message || "Failed to accept KFS");
      } else {
        toast.success("Key Fact Statement accepted");
        setModalKind(null);
      }
    } catch {
      toast.error("Network error");
    }
  };

  const openForecloseModal = async (loanId: string) => {
    setModalKind("foreclose");
    setModalLoanId(loanId);
    setModalTitle(`Loan Foreclosure Quote (#${loanId.slice(0, 8).toUpperCase()})`);
    setModalData(null);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/portal/loans/${encodeURIComponent(loanId)}/foreclosure-quote`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        toast.error(json?.message || "Unable to fetch foreclosure quote");
      } else {
        setModalData(json?.data || json);
      }
    } catch {
      toast.error("Failed to fetch foreclosure quote");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
          <p className="text-muted-foreground mt-1">
            View active accounts, repayment schedules, KFS disclosures, and pay EMIs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search loan ID or status..."
              className="h-9 pl-9 pr-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card p-1 text-xs font-medium">
            {(["ALL", "ACTIVE", "IN_PROGRESS", "CLOSED"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-lg transition ${statusFilter === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "ALL"
                  ? "All"
                  : tab === "ACTIVE"
                    ? "Active"
                    : tab === "IN_PROGRESS"
                      ? "In Progress"
                      : "Closed"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredLoans.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-12 text-center space-y-3">
          <p className="text-lg font-semibold">No matching loans found</p>
          <p className="text-sm text-muted-foreground">
            {loans.length === 0
              ? "You haven't applied for a loan yet."
              : "Try clearing your search filter."}
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            Apply for a Loan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredLoans.map((loan) => {
            const upperStatus = (loan.status || "").toUpperCase();
            const isActive = ["DISBURSED", "ACTIVE", "OVERDUE"].includes(upperStatus);
            const isClosed = ["CLOSED", "REJECTED", "CANCELLED", "COOLING_OFF_CANCELLED"].includes(
              upperStatus
            );
            const progressPct = Math.min(100, Math.max(0, Math.round((loan.progress || 0) * 100)));

            return (
              <div
                key={loan.id}
                className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${upperStatus === "OVERDUE"
                            ? "bg-rose-500/10 text-rose-500"
                            : isActive
                              ? "bg-emerald-500/10 text-emerald-500"
                              : isClosed
                                ? "bg-muted text-muted-foreground"
                                : "bg-blue-500/10 text-blue-600"
                          }`}
                      >
                        {upperStatus.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        #{loan.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{loan.title || "Instant Personal Loan"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Interest Rate: {loan.interest_rate}% p.a. • Tenure: {loan.tenure_months} Months
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Loan Amount</p>
                      <p className="text-lg font-bold">
                        ₹{Math.round(loan.approved_amount || loan.loan_amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly EMI</p>
                      <p className="text-lg font-bold">
                        ₹{Math.round(loan.emi_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Next Due Date</p>
                      <p className="text-lg font-bold">{loan.next_emi_date || "—"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => openStatementModal(loan.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Statement
                    </button>
                    <button
                      type="button"
                      onClick={() => openKfsModal(loan.id)}
                      className="px-3.5 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      KFS
                    </button>
                    {!isActive && !isClosed && (
                      <Link
                        href={`/apply/status?loan_id=${encodeURIComponent(loan.id)}`}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        Resume Application
                      </Link>
                    )}
                  </div>
                </div>

                {isActive && (
                  <>
                    <div className="bg-muted/30 px-6 py-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Repayment Progress</span>
                      <span className="font-semibold">{progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="border-t border-border p-4 flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => openForecloseModal(loan.id)}
                        className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-xs font-semibold transition-colors"
                      >
                        Foreclose Loan
                      </button>
                      <RazorpayCheckoutButton
                        amount={loan.emi_amount}
                        loanId={loan.id}
                        paymentType="emi"
                        purpose={`EMI Payment - ${loan.title || "Personal Loan"}`}
                        userDetails={{
                          name: user?.full_name || undefined,
                          email: user?.email || undefined,
                          contact: user?.mobile_number || undefined,
                        }}
                        buttonText={`Pay EMI (₹${Math.round(loan.emi_amount).toLocaleString("en-IN")})`}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalKind && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg">{modalTitle}</h3>
              <button
                type="button"
                onClick={() => setModalKind(null)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              {modalLoading ? (
                <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading document...</span>
                </div>
              ) : modalKind === "statement" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Payable</p>
                      <p className="font-bold">
                        ₹{Number(modalData?.schedule?.total_payable || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Paid So Far</p>
                      <p className="font-bold text-emerald-600">
                        ₹{Number(modalData?.schedule?.total_paid || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Outstanding</p>
                      <p className="font-bold">
                        ₹{Number(modalData?.schedule?.outstanding_balance || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                    {(modalData?.schedule?.emis || []).map((emi: any) => (
                      <div key={emi.id} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Installment #{emi.installment_number}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(emi.due_date).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{Number(emi.amount).toLocaleString("en-IN")}</p>
                          <span
                            className={`text-xs font-medium ${emi.is_paid ? "text-emerald-600" : "text-amber-600"
                              }`}
                          >
                            {emi.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : modalData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Sanctioned Amount</p>
                      <p className="font-bold">
                        ₹{Number(modalData.sanctioned_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Net Disbursed</p>
                      <p className="font-bold text-emerald-600">
                        ₹{Number(modalData.net_disbursed_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">APR</p>
                      <p className="font-bold">{modalData.apr_percentage || modalData.apr || "—"}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly EMI</p>
                      <p className="font-bold">
                        ₹{Number(modalData.emi_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-1">
                    <p className="font-semibold text-blue-700 dark:text-blue-300">
                      RBI Digital Lending Guidelines Disclosure
                    </p>
                    <p className="text-muted-foreground">
                      Cooling-off / look-up period: 3 days from disbursement with zero prepayment penalty.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAcceptKfs}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept Key Fact Statement
                    </button>
                  </div>
                </div>
              ) : modalKind === "foreclose" && modalData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Principal Outstanding</p>
                      <p className="font-bold">
                        ₹{Number(modalData.principal_outstanding ?? modalData.outstanding_principal ?? 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Foreclosure Charges</p>
                      <p className="font-bold text-emerald-600">
                        ₹{Number(modalData.foreclosure_charges || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-semibold">Total Foreclosure Payoff</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{Number(modalData.total_foreclosure_amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <RazorpayCheckoutButton
                      amount={Number(modalData.total_foreclosure_amount || 0)}
                      loanId={modalLoanId}
                      paymentType="foreclosure"
                      purpose={`Loan Foreclosure (#${modalLoanId.slice(0, 8).toUpperCase()})`}
                      userDetails={{
                        name: user?.full_name || undefined,
                        email: user?.email || undefined,
                        contact: user?.mobile_number || undefined,
                      }}
                      onSuccess={() => {
                        setModalKind(null);
                        toast.success("Loan foreclosed successfully!");
                      }}
                      buttonText={`Pay & Foreclose (₹${Math.round(Number(modalData.total_foreclosure_amount || 0)).toLocaleString("en-IN")})`}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Document details unavailable.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
