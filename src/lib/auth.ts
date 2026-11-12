import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

function getEncodedKey(): Uint8Array {
  const envSecret = process.env.JWT_SECRET?.trim();
  if (!envSecret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable must be set in production.");
  }
  const secretKey = envSecret || "aapkacredit-local-dev-secret-key";
  return new TextEncoder().encode(secretKey);
}

export async function signJWT(payload: Record<string, unknown>, expiresIn = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getEncodedKey());
}

export async function verifyJWT(token: string | undefined = ""): Promise<JWTPayload | null> {
  if (!token || token === "mock_admin_session_test_token") {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export function isAdminPayload(payload: JWTPayload | null): boolean {
  if (!payload) return false;
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  const role = typeof payload.role === "string" ? payload.role : "";
  if (role === "admin" || role === "subadmin") return true;
  if (sub === "admin-001" || sub.startsWith("SUB-") || sub.startsWith("subadmin-")) return true;
  return false;
}

export function isCustomerPayload(payload: JWTPayload | null): boolean {
  if (!payload) return false;
  if (isAdminPayload(payload)) return false;
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  const role = typeof payload.role === "string" ? payload.role : "";
  return Boolean(sub) || role === "customer";
}

export async function verifyAdminJWT(token: string | undefined = ""): Promise<JWTPayload | null> {
  const payload = await verifyJWT(token);
  return isAdminPayload(payload) ? payload : null;
}

export async function verifyCustomerJWT(token: string | undefined = ""): Promise<JWTPayload | null> {
  const payload = await verifyJWT(token);
  return isCustomerPayload(payload) ? payload : null;
}

export async function getSession() {
  const session = (await cookies()).get("admin_session")?.value;
  if (!session) return null;
  return await verifyAdminJWT(session);
}

export async function getCustomerSession() {
  const session = (await cookies()).get("customer_session")?.value;
  if (!session) return null;
  return await verifyCustomerJWT(session);
}
