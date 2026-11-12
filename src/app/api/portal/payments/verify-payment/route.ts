import { NextRequest } from "next/server";
import { proxyCustomerBackend } from "@/lib/portalProxy";

export async function POST(req: NextRequest) {
  return proxyCustomerBackend(req, "/payments/verify-payment");
}
