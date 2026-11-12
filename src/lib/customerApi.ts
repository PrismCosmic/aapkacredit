import { cookies } from "next/headers";
import { verifyCustomerJWT } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface CustomerUser {
  id?: string;
  mobile_number?: string;
  email?: string;
  full_name?: string;
  dob?: string;
  gender?: string;
  current_address?: string;
  pan_number?: string;
  aadhar_number?: string;
  credit_score?: number;
  is_active?: boolean;
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at?: string;
}

export interface CustomerLoanSummary {
  id: string;
  status: string;
  title?: string;
  loan_amount: number;
  requested_amount: number;
  approved_amount: number;
  tenure_months: number;
  interest_rate: number;
  emi_amount: number;
  remaining: number;
  total: number;
  progress: number;
  next_emi_date?: string;
  created_at?: string | null;
}

async function fetchCustomerBackend<T = any>(
  path: string
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  const token = (await cookies()).get("customer_session")?.value;
  const verified = token ? await verifyCustomerJWT(token) : null;
  if (!token || !verified) {
    return { ok: false, status: 401, data: null, error: "Not authenticated" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const json = await res.json().catch(() => null);
    if (!res.ok || !json || json.success === false) {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: json?.message || json?.detail || `Request failed (${res.status})`,
      };
    }

    return { ok: true, status: res.status, data: (json.data ?? json) as T };
  } catch {
    return { ok: false, status: 502, data: null, error: "Backend unavailable" };
  }
}

export async function fetchCustomerMe() {
  return fetchCustomerBackend<CustomerUser>("/users/me");
}

export async function fetchDashboardSummary() {
  return fetchCustomerBackend<any>("/loans/dashboard-summary");
}

export async function fetchCustomerLoans() {
  const res = await fetchCustomerBackend<{ loans: CustomerLoanSummary[] }>("/loans");
  return {
    ...res,
    loans: res.data?.loans ?? [],
  };
}

export async function fetchLoanById(loanId: string) {
  return fetchCustomerBackend<any>(`/loans/${encodeURIComponent(loanId)}`);
}

export async function fetchCustomerNotifications() {
  const res = await fetchCustomerBackend<{ notifications: CustomerNotification[] }>("/notifications");
  return {
    ...res,
    notifications: res.data?.notifications ?? [],
  };
}

export async function fetchCustomerCreditScore() {
  return fetchCustomerBackend<any>("/users/credit-score");
}

export async function fetchCustomerBankAccounts() {
  return fetchCustomerBackend<any>("/users/bank-accounts");
}
