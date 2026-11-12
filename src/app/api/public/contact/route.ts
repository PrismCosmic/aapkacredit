import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  topic: z.string().trim().min(2).max(80).default("General Inquiry"),
  message: z.string().trim().min(10).max(1000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse({
      ...body,
      phone: String(body?.phone ?? "").replace(/\D/g, "").slice(-10),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid inquiry payload.",
        },
        { status: 400 }
      );
    }

    const referenceId = `INQ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    console.info("[Public Contact Inquiry]", {
      referenceId,
      topic: parsed.data.topic,
      email: parsed.data.email,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      referenceId,
      message: "Inquiry submitted successfully. Our lending advisor will reach out shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to submit contact request right now." },
      { status: 500 }
    );
  }
}
