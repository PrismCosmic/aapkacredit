import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerJWT } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function proxyCustomerBackend(
  req: NextRequest,
  backendPath: string
): Promise<NextResponse> {
  const token = req.cookies.get("customer_session")?.value;
  const verified = token ? await verifyCustomerJWT(token) : null;

  if (!token || !verified) {
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }

  const normalizedPath = backendPath.startsWith("/") ? backendPath : `/${backendPath}`;
  const query = req.nextUrl.search || "";
  const targetUrl = `${API_URL}${normalizedPath}${query}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | undefined;
  const method = req.method.toUpperCase();

  if (method !== "GET" && method !== "HEAD") {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
    } else if (contentType.includes("application/json")) {
      headers["Content-Type"] = "application/json";
      body = await req.text();
    } else {
      const text = await req.text();
      if (text) {
        headers["Content-Type"] = contentType || "application/json";
        body = text;
      }
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const resContentType = res.headers.get("content-type") || "";
    if (resContentType.includes("application/json")) {
      const data = await res.json().catch(() => ({}));
      const response = NextResponse.json(data, { status: res.status });
      if (res.status === 401) {
        response.cookies.delete("customer_session");
      }
      return response;
    }

    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
      status: res.status,
      headers: {
        "Content-Type": resContentType || "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("Customer proxy error:", targetUrl, err);
    return NextResponse.json(
      { success: false, message: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
