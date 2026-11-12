import { NextRequest } from "next/server";
import { proxyCustomerBackend } from "@/lib/portalProxy";

export async function GET(req: NextRequest) {
  return proxyCustomerBackend(req, "/notifications");
}
