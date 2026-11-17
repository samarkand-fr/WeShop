import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
  : null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed");
  }

  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send("Stripe webhook is not configured");
  }

  const signature = req.headers["stripe-signature"];
  if (!signature || Array.isArray(signature)) {
    return res.status(400).send("Missing or invalid Stripe signature");
  }

  let event: Stripe.Event;

  try {
    const payload = await buffer(req);
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return res.status(400).send("Webhook signature verification failed");
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
          where: { paymentIntentId: paymentIntent.id },
          data: { status: "complete" },
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.order.updateMany({
          where: {
            paymentIntentId: paymentIntent.id,
            status: "pending",
          },
          data: { status: "failed" },
        });
        break;
      }
      default:
        console.log("Unhandled Stripe event:", event.type);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Unable to process Stripe webhook:", error);
    return res.status(500).send("Webhook processing failed");
  }
}
