import { NextRequest } from "next/server";
import { proxyCustomerBackend } from "@/lib/portalProxy";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(req: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const suffix = path.length > 0 ? `/${path.map(encodeURIComponent).join("/")}` : "";
  return proxyCustomerBackend(req, `/users${suffix}`);
}

export async function GET(req: NextRequest, context: RouteContext) {
  return handle(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return handle(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return handle(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return handle(req, context);
}
