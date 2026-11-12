"use client";

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayCheckoutOptions {
  amount: number; // in paise
  currency?: string;
  name?: string;
  description?: string;
  receipt?: string;
  loanId?: string;
  purpose?: string;
  paymentType?: "emi" | "fee" | "foreclosure" | "other";
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  onSuccess?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    payment_id: string;
    order_id: string;
    [key: string]: unknown;
  }) => void;
  onFailure?: (error: { message: string; [key: string]: unknown }) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout.js SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Standard Checkout through authenticated Next.js API proxy routes:
 * 1. Calls /api/portal/payments/create-order (falls back to /api/create-order if backend order endpoint unavailable)
 * 2. Launches Razorpay modal window with customer prefill (if provided)
 * 3. Verifies signature via /api/portal/payments/verify-payment and updates loan fee/repayment if applicable
 */
export async function initiateRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    options.onFailure?.({
      message: "Unable to load Razorpay SDK. Please check your internet connection.",
    });
    return;
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  if (!keyId) {
    options.onFailure?.({
      message: "Payment gateway is not configured (missing Razorpay public key).",
    });
    return;
  }

  let orderData: { order_id: string; amount: number; currency?: string };
  try {
    const payload = {
      amount: Math.round(options.amount),
      currency: options.currency || "INR",
      receipt: options.receipt || `rcpt_${Date.now()}`,
      notes: {
        ...(options.notes || {}),
        ...(options.loanId ? { loan_id: options.loanId } : {}),
        ...(options.purpose ? { purpose: options.purpose } : {}),
      },
    };

    let orderRes = await fetch("/api/portal/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (orderRes.status === 404 || orderRes.status === 502) {
      orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const parsed = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok) {
      throw new Error(parsed?.error || parsed?.message || "Failed to initialize Razorpay order");
    }

    const rawOrder = parsed?.data || parsed;
    if (!rawOrder?.order_id) {
      throw new Error("Order ID missing from payment gateway response");
    }
    orderData = rawOrder;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating Razorpay order";
    console.error("Razorpay order creation error:", error);
    options.onFailure?.({ message });
    return;
  }

  const cleanPrefill: RazorpayPrefill = {};
  if (options.prefill?.name) cleanPrefill.name = options.prefill.name;
  if (options.prefill?.email) cleanPrefill.email = options.prefill.email;
  if (options.prefill?.contact) cleanPrefill.contact = options.prefill.contact;

  const razorpayOptions: Record<string, unknown> = {
    key: keyId,
    amount: orderData.amount,
    currency: orderData.currency || options.currency || "INR",
    name: options.name || "Aapka Credit",
    description: options.description || options.purpose || "Loan Payment",
    order_id: orderData.order_id,
    theme: {
      color: "#2563eb",
    },
    ...(Object.keys(cleanPrefill).length > 0 ? { prefill: cleanPrefill } : {}),
    notes: {
      ...(options.notes || {}),
      ...(options.loanId ? { loan_id: options.loanId } : {}),
    },
    modal: {
      ondismiss: () => {
        options.onFailure?.({ message: "Payment cancelled by user" });
      },
    },
    handler: async function (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) {
      try {
        let verifyRes = await fetch("/api/portal/payments/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        if (verifyRes.status === 404 || verifyRes.status === 502) {
          verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
        }

        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyRes.ok || verifyData?.status === "failed") {
          options.onFailure?.({
            message: verifyData?.error || verifyData?.message || "Payment verification failed",
            ...verifyData,
          });
          return;
        }

        if (options.loanId && options.paymentType === "fee") {
          const feeRes = await fetch("/api/portal/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loan_id: options.loanId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const feeJson = await feeRes.json().catch(() => ({}));
          if (!feeRes.ok || feeJson?.success === false) {
            options.onFailure?.({
              message: feeJson?.message || "Payment captured, but fee update failed. Contact support.",
            });
            return;
          }
        } else if (options.loanId && options.paymentType === "emi") {
          const repayRes = await fetch(
            `/api/portal/loans/${encodeURIComponent(options.loanId)}/repay`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: Math.round(options.amount / 100),
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );
          const repayJson = await repayRes.json().catch(() => ({}));
          if (!repayRes.ok || repayJson?.success === false) {
            options.onFailure?.({
              message: repayJson?.message || repayJson?.detail || "Payment captured, but EMI ledger update failed. Contact support.",
            });
            return;
          }
        } else if (options.loanId && options.paymentType === "foreclosure") {
          const forecloseRes = await fetch(
            `/api/portal/loans/${encodeURIComponent(options.loanId)}/foreclose`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: Math.round(options.amount / 100),
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );
          const forecloseJson = await forecloseRes.json().catch(() => ({}));
          if (!forecloseRes.ok || forecloseJson?.success === false) {
            options.onFailure?.({
              message: forecloseJson?.message || forecloseJson?.detail || "Payment captured, but foreclosure update failed. Contact support.",
            });
            return;
          }
        }

        options.onSuccess?.({
          ...verifyData,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error verifying payment signature";
        options.onFailure?.({ message });
      }
    },
  };

  const rzp = new window.Razorpay(razorpayOptions);
  rzp.on("payment.failed", (resp: unknown) => {
    const errObj = (resp as { error?: { description?: string } })?.error;
    options.onFailure?.({
      message: errObj?.description || "Payment declined by bank/gateway",
      raw: resp,
    });
  });

  rzp.open();
}
