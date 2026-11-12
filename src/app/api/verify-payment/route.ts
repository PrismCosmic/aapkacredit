import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyCustomerJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("customer_session")?.value;
    const verified = token ? await verifyCustomerJWT(token) : null;
    if (!verified) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment verification secret is not configured on the server." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing required Razorpay verification fields" },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    const isSignatureValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isSignatureValid) {
      return NextResponse.json(
        { status: "failed", error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Payment verified successfully",
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return NextResponse.json(
      { error: "Internal server error during payment verification" },
      { status: 500 }
    );
  }
}
