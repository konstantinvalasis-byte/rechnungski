import Stripe from "stripe";

// Stripe-Server-Client (nur serverseitig verwenden)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// Price IDs aus Env
export const STRIPE_PRICES = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
    yearly:  process.env.STRIPE_PRICE_STARTER_YEARLY!,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    yearly:  process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
} as const;

export type Plan = "free" | "starter" | "pro";
export type Period = "monthly" | "yearly";
