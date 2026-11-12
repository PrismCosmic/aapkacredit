import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const careersSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  role: z.string().trim().min(2).max(100),
  portfolio: z.string().trim().min(5).max(300),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = careersSchema.safeParse({
      ...body,
      phone: String(body?.phone ?? "").replace(/\D/g, "").slice(-10),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Please complete all required application fields.",
        },
        { status: 400 }
      );
    }

    const applicationId = `CAR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    console.info("[Public Careers Application]", {
      applicationId,
      role: parsed.data.role,
      email: parsed.data.email,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Application received! Our talent team will review your profile.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to submit application right now." },
      { status: 500 }
    );
  }
}
