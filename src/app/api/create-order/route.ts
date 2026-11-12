import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("customer_session")?.value;
    const verified = token ? await verifyCustomerJWT(token) : null;
    if (!verified) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID?.trim() ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment gateway is not configured on the server." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt, notes = {} } = body;

    if (!amount || typeof amount !== "number" || !Number.isFinite(amount) || amount < 100) {
      return NextResponse.json(
        { error: "Valid amount (at least 100 paise) is required" },
        { status: 400 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.description || "Failed to create Razorpay order" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      status: data.status,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { error: "Internal server error during order creation" },
      { status: 500 }
    );
  }
}
