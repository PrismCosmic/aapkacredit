"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function loginAction(_prevState: unknown, formData: FormData) {
  const username = (formData.get("username") as string | null)?.trim() || "";
  const password = (formData.get("password") as string | null) || "";

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  let res: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    res = await fetch(`${API_URL}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);
  } catch {
    return { error: "Unable to reach authentication server. Please try again later." };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.success || !data?.data?.access_token) {
    return { error: data?.message || data?.detail || "Invalid admin or subadmin credentials" };
  }

  const token = String(data.data.access_token);
  const role = typeof data.data.role === "string" ? data.data.role : "admin";

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  cookieStore.set("admin_meta", JSON.stringify({ username, role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("admin_meta");
  redirect("/admin/login");
}
