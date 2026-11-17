import Stripe from "stripe";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import { CartProductType } from "@/types";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" })
  : null;

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment service is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const items = body?.items as CartProductType[] | undefined;
    const paymentIntentId = body?.payment_intent_id as string | undefined;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some(
        (item) =>
          !item ||
          typeof item.id !== "string" ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
      )
    ) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    // Never trust prices or product descriptions supplied by the browser.
    const productIds = [...new Set(items.map((item) => item.id))];
    const databaseProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (databaseProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are no longer available" },
        { status: 400 }
      );
    }

    const productsById = new Map(databaseProducts.map((product) => [product.id, product]));
    const verifiedItems: CartProductType[] = [];

    for (const item of items) {
      const product = productsById.get(item.id);
      if (!product || !product.inStock || !product.images.length) {
        return NextResponse.json(
          { error: `${product?.name ?? "A product"} is out of stock` },
          { status: 409 }
        );
      }

      const selectedImage =
        product.images.find(
          (image) => image.color === item.selectedImg?.color
        ) ?? product.images[0];

      verifiedItems.push({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        selectedImg: selectedImage,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const total = Math.round(
      verifiedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) * 100
    );

    if (total < 50) {
      return NextResponse.json(
        { error: "The order total is below the minimum payment amount" },
        { status: 400 }
      );
    }

    if (paymentIntentId) {
      const existingOrder = await prisma.order.findFirst({
        where: { paymentIntentId, userId: currentUser.id },
      });

      if (!existingOrder) {
        return NextResponse.json(
          { error: "Payment session not found" },
          { status: 404 }
        );
      }

      const currentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (
        currentIntent.metadata.userId !== currentUser.id ||
        !["requires_payment_method", "requires_confirmation"].includes(
          currentIntent.status
        )
      ) {
        return NextResponse.json(
          { error: "This payment session can no longer be updated" },
          { status: 409 }
        );
      }

      const updatedIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: total,
      });
      const updatedOrder = await prisma.order.update({
        where: { paymentIntentId },
        data: { amount: total, products: verifiedItems },
      });

      return NextResponse.json({
        paymentIntent: updatedIntent,
        order: updatedOrder,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: currentUser.id },
    });

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: currentUser.id } },
        amount: total,
        currency: "usd",
        status: "pending",
        deliveryStatus: "pending",
        paymentIntentId: paymentIntent.id,
        products: verifiedItems,
      },
    });

    return NextResponse.json({ paymentIntent, order });
  } catch (error) {
    console.error("Unable to create payment intent:", error);
    return NextResponse.json(
      { error: "Unable to initialize checkout" },
      { status: 500 }
    );
  }
}
