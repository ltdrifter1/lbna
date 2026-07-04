import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";

interface CheckoutLine {
  id: string;
  holeCount: number | null;
  finish: string;
  decalColor: string;
  quantity: number;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment to enable checkout.",
      },
      { status: 503 },
    );
  }

  let body: { items?: CheckoutLine[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const stripe = new Stripe(secret);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of items) {
    const product = getProductById(item.id);
    if (!product) continue;

    const quantity = Math.max(1, Math.min(item.quantity, product.stock || 1));
    const descriptionParts = [
      item.holeCount ? `${item.holeCount}H` : null,
      item.finish,
      item.decalColor,
    ].filter(Boolean);

    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: `${product.model} — ${product.series}`,
          description: descriptionParts.join(" · ") || undefined,
        },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No valid items in cart." },
      { status: 400 },
    );
  }

  const origin =
    request.headers.get("origin") ??
    new URL(request.url).origin ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to start checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
