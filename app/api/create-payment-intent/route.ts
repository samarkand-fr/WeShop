// Import necessary modules and dependencies
import Stripe from "stripe";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import { CartProductType } from "@/types";

// Create a new instance of Stripe using the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

// Function to calculate the total order amount based on items
const calculateOrderAmount = (items: CartProductType[]): number => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);
  const price: any = Math.floor(totalPrice);
  return price;
};

// Handling the POST request for creating payment intent and processing the order
export async function POST(request: Request) {
  // Get the current user using the getCurrentUser function
  const currentUser = await getCurrentUser();

  // Check if the user is not authenticated
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the request body
  const body = await request.json();
  const { items, payment_intent_id } = body;

  // Calculate the total order amount
  const total = Math.round(calculateOrderAmount(items) * 100);

  // Define order data for database insertion
  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
  };

  // Check if payment_intent_id exists
  if (payment_intent_id) {
    // Retrieve the current payment intent from Stripe
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    // Check if the current payment intent exists
    if (current_intent) {
      // Update the amount of the payment intent
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total }
      );

      // Update the order in the database
      const updated_order = await prisma.order.update({
        where: { paymentIntentId: payment_intent_id },
        data: {
          amount: total,
          products: items,
        },
      });

      // Return the updated payment intent and order
      return NextResponse.json({ paymentIntent: updated_intent, order: updated_order });
    }
  } else {
    // If payment_intent_id doesn't exist, create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Update the order data with the new payment intent id
    orderData.paymentIntentId = paymentIntent.id;

    // Create a new order in the database
    const created_order = await prisma.order.create({
      data: orderData,
    });

    // Return the created payment intent and order
    return NextResponse.json({ paymentIntent, order: created_order });
  }

  // Return a default response if none of the conditions are valid
  return NextResponse.error();
}
//   // Check if payment_intent_id exists
//   if (payment_intent_id) {
//     // Retrieve the current payment intent from Stripe
//     const current_intent = await stripe.paymentIntents.retrieve(
//       payment_intent_id
//     );

//     // Check if the current payment intent exists
//     if (current_intent) {
//       // Update the amount of the payment intent
//       const updated_intent = await stripe.paymentIntents.update(
//         payment_intent_id,
//         { amount: total }
//       );

//       // Update the order in the database
//       const [existing_order, update_order] = await Promise.all([
//         prisma.order.findFirst({
//           where: { paymentIntentId: payment_intent_id },
//         }),
//         prisma.order.update({
//           where: { paymentIntentId: payment_intent_id },
//           data: {
//             amount: total,
//             products: items,
//           },
//         }),
//       ]);

//       // Check if the existing order doesn't exist
//       if (!existing_order) {
//         return NextResponse.json(
//           { error: "Invalid payment intent" },
//           { status: 400 }
//         );
//       }

//       // Return the updated payment intent
//       return NextResponse.json({ paymentIntent: updated_intent });
//     }
//   } else {
//     // If payment_intent_id doesn't exist, create a new payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     // Update the order data with the new payment intent id
//     orderData.paymentIntentId = paymentIntent.id;

//     // Create a new order in the database
//     await prisma.order.create({
//       data: orderData,
//     });

//     // Return the created payment intent
//     return NextResponse.json({ paymentIntent });
//   }

//   // Return a default response if none of the conditions are valid
//   return NextResponse.error();
// }
