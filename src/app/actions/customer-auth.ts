"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function sendOtpAction(mobileNumber: string) {
  const cleanPhone = mobileNumber.replace(/\D/g, "");
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return { success: false, error: "Please enter a valid 10-digit Indian mobile number" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile_number: cleanPhone }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
      return { success: false, error: data?.message || data?.detail || "Failed to send OTP" };
    }
    return { success: true, message: data.message || "OTP sent successfully" };
  } catch {
    return { success: false, error: "Unable to reach OTP service. Please try again." };
  }
}

export async function customerLoginAction(
  phone: string,
  otp: string,
  referralCode?: string
): Promise<{ success: boolean; error?: string }> {
  const cleanPhone = phone.replace(/\D/g, "");
  const cleanOtp = otp.trim();

  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return { success: false, error: "Invalid mobile number" };
  }
  if (!/^\d{4,6}$/.test(cleanOtp)) {
    return { success: false, error: "Please enter a valid numeric OTP" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile_number: cleanPhone,
        otp: cleanOtp,
        ...(referralCode?.trim() ? { referral_code: referralCode.trim() } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success || !data?.data?.access_token) {
      return {
        success: false,
        error: data?.message || data?.detail || "Invalid or expired OTP. Please try again.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("customer_session", String(data.data.access_token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    if (data.data.refresh_token) {
      cookieStore.set("customer_refresh", String(data.data.refresh_token), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: "Unable to verify OTP right now. Please try again." };
  }
}

export async function customerLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_session");
  cookieStore.delete("customer_refresh");
  redirect("/");
}
