import { NextRequest } from "next/server";
import { proxyCustomerBackend } from "@/lib/portalProxy";

type RouteContext = { params: Promise<{ docType: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { docType } = await context.params;
  return proxyCustomerBackend(req, `/documents/${encodeURIComponent(docType)}`);
}
