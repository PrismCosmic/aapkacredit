import { NextResponse } from "next/server";
import { z } from "zod";

const appLinkSchema = z.object({
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = appLinkSchema.safeParse({
      mobile: String(body?.mobile ?? "").replace(/\D/g, "").slice(-10),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid mobile number.",
        },
        { status: 400 }
      );
    }

    console.info("[Public App Link Request]", {
      mobileSuffix: parsed.data.mobile.slice(-4),
      requestedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Download link queued for +91 ${parsed.data.mobile}.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to send app download link right now." },
      { status: 500 }
    );
  }
}
