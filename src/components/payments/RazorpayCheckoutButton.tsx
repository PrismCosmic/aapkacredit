"use client";

import { useState } from "react";
import { initiateRazorpayCheckout } from "@/lib/razorpay";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RazorpayCheckoutButtonProps {
  amount: number; // in Rupees (e.g. 4500)
  buttonText?: string;
  className?: string;
  loanId?: string;
  purpose?: string;
  paymentType?: "emi" | "fee" | "foreclosure" | "other";
  userDetails?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
}

export function RazorpayCheckoutButton({
  amount,
  buttonText,
  className,
  loanId,
  purpose = "Loan Repayment / Processing Fee",
  paymentType = loanId ? "emi" : "other",
  userDetails,
  onSuccess,
  onFailure,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    if (loading || amount <= 0) return;
    setLoading(true);

    const amountInPaise = Math.round(amount * 100);

    await initiateRazorpayCheckout({
      amount: amountInPaise,
      currency: "INR",
      description: purpose,
      purpose,
      loanId,
      paymentType,
      prefill: userDetails,
      onSuccess: (data) => {
        setLoading(false);
        setPaid(true);
        toast.success(`Payment successful! ID: ${data.payment_id}`);
        onSuccess?.(data);
      },
      onFailure: (error) => {
        setLoading(false);
        toast.error(error?.message || "Payment failed or cancelled.");
        onFailure?.(error);
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading || paid || amount <= 0}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
      }
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : paid ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          <span>Paid Successfully</span>
        </>
      ) : (
        <>
          <ShieldCheck className="h-4 w-4" />
          <span>{buttonText || `Pay ₹${amount.toLocaleString("en-IN")}`}</span>
        </>
      )}
    </button>
  );
}
