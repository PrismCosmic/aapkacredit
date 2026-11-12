"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface LoanOption {
  id: string;
  title?: string;
  status: string;
  emi_amount: number;
  approved_amount: number;
  loan_amount: number;
}

interface UserProfile {
  full_name?: string;
  email?: string;
  mobile_number?: string;
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<LoanOption[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"emi" | "fee">("emi");
  const [amount, setAmount] = useState<number>(0);
  const [lastPayment, setLastPayment] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramLoanId = params.get("loan_id") || "";
    const paramAmount = Number(params.get("amount") || 0);
    const paramType = params.get("type") === "fee" ? "fee" : "emi";
    setPaymentType(paramType);

    async function load() {
      try {
        const [meRes, loansRes] = await Promise.all([
          fetch("/api/portal/users/me"),
          fetch("/api/portal/loans"),
        ]);
        const meJson = await meRes.json().catch(() => ({}));
        const loansJson = await loansRes.json().catch(() => ({}));

        if (meRes.ok && meJson?.data) {
          setUser(meJson.data);
        }

        const list: LoanOption[] = loansJson?.data?.loans || [];
        setLoans(list);

        const matched =
          list.find((l) => l.id === paramLoanId) ||
          list.find((l) => ["DISBURSED", "ACTIVE", "OVERDUE"].includes((l.status || "").toUpperCase())) ||
          list[0];

        if (matched) {
          setSelectedLoanId(matched.id);
          if (paramAmount > 0) {
            setAmount(paramAmount);
          } else if (paramType === "fee") {
            const principal = matched.approved_amount || matched.loan_amount || 50000;
            setAmount(Math.round(Math.max(999, principal * 0.025) * 1.18));
          } else {
            setAmount(Math.round(matched.emi_amount || 0));
          }
        } else if (paramAmount > 0) {
          setAmount(paramAmount);
        }
      } catch {
        setError("Unable to load your loan checkout details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const selectedLoan = loans.find((l) => l.id === selectedLoanId);

  const handleLoanChange = (id: string) => {
    setSelectedLoanId(id);
    const target = loans.find((l) => l.id === id);
    if (target) {
      if (paymentType === "fee") {
        const principal = target.approved_amount || target.loan_amount || 50000;
        setAmount(Math.round(Math.max(999, principal * 0.025) * 1.18));
      } else {
        setAmount(Math.round(target.emi_amount || 0));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Standard Checkout
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Repayment &amp; Fee Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your EMI repayment or loan fee payment securely via Razorpay.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-card border border-border p-12 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your loan details...</span>
        </div>
      ) : loans.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-10 text-center space-y-3">
          <CreditCard className="w-10 h-10 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-bold">No Active Loans to Pay</h2>
          <p className="text-sm text-muted-foreground">
            You do not have any pending EMIs or loan fees at the moment.
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Select Loan &amp; Payment Type
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    Loan Account
                  </label>
                  <select
                    value={selectedLoanId}
                    onChange={(e) => handleLoanChange(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {loans.map((loan) => (
                      <option key={loan.id} value={loan.id}>
                        #{loan.id.slice(0, 8).toUpperCase()} • {loan.title || "Personal Loan"} (
                        {loan.status.replace(/_/g, " ")})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType("emi");
                      if (selectedLoan) setAmount(Math.round(selectedLoan.emi_amount || 0));
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      paymentType === "emi"
                        ? "border-blue-600 bg-blue-600/5"
                        : "border-border hover:border-blue-400"
                    }`}
                  >
                    <p className="text-sm font-bold">Monthly EMI</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{Math.round(selectedLoan?.emi_amount || 0).toLocaleString("en-IN")}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType("fee");
                      if (selectedLoan) {
                        const p = selectedLoan.approved_amount || selectedLoan.loan_amount || 50000;
                        setAmount(Math.round(Math.max(999, p * 0.025) * 1.18));
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      paymentType === "fee"
                        ? "border-blue-600 bg-blue-600/5"
                        : "border-border hover:border-blue-400"
                    }`}
                  >
                    <p className="text-sm font-bold">Processing / Assessment Fee</p>
                    <p className="text-xs text-muted-foreground">Incl. 18% GST</p>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                Payable Amount (₹)
              </label>
              <input
                type="number"
                min={100}
                value={amount || ""}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 text-sm font-bold border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-3 text-xs text-muted-foreground">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-foreground block">
                  Bank-Grade 256-Bit TLS Encryption
                </span>
                <span>
                  UPI, cards, and netbanking transactions are verified server-side via HMAC-SHA256 before updating your loan ledger.
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold border-b border-border pb-3">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Payment For</span>
                <span className="font-semibold text-foreground">
                  {paymentType === "fee" ? "Loan Processing Fee" : "EMI Installment"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Loan Account</span>
                <span className="font-mono text-xs text-foreground">
                  {selectedLoanId ? `#${selectedLoanId.slice(0, 8).toUpperCase()}` : "—"}
                </span>
              </div>
              {user?.full_name && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Borrower</span>
                  <span className="font-medium text-foreground">{user.full_name}</span>
                </div>
              )}

              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="font-bold">Total Payable</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <RazorpayCheckoutButton
              amount={amount}
              loanId={selectedLoanId}
              paymentType={paymentType}
              purpose={
                paymentType === "fee"
                  ? `Processing Fee - Loan #${selectedLoanId.slice(0, 8).toUpperCase()}`
                  : `EMI Payment - Loan #${selectedLoanId.slice(0, 8).toUpperCase()}`
              }
              userDetails={{
                name: user?.full_name || undefined,
                email: user?.email || undefined,
                contact: user?.mobile_number || undefined,
              }}
              className="w-full justify-center py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-500/25 flex items-center gap-2"
              buttonText={`Pay ₹${amount.toLocaleString("en-IN")} via Razorpay`}
              onSuccess={(data) => setLastPayment(data)}
            />

            {lastPayment && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Payment Confirmed &amp; Verified
                </div>
                <p>
                  Payment ID: <span className="font-mono font-bold">{lastPayment.payment_id}</span>
                </p>
                <Link
                  href="/loans"
                  className="inline-flex items-center gap-1 font-bold underline pt-1"
                >
                  View Updated Loan Statement <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
