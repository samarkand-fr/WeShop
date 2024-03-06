import Stripe from "stripe";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser  from "@/actions/getCurrentUser";
import { CartProductType } from "@/types";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const calculateOrderAmount = (items: CartProductType[]):number => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);
  const price:any = Math.floor(totalPrice)
  return price;
};


export async function POST(request: Request){
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { items, payment_intent_id } = body;
  const total = Math.round(calculateOrderAmount(items) * 100);
  const orderData = {
    user: { connect: { id: currentUser.id} },
    amount: total,
    currency: "usd",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total }
      );
      // update order
      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId: payment_intent_id },
        }),
        prisma.order.update({
          where: { paymentIntentId: payment_intent_id },
          data: {
            amount: total,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.json(
          { error: "invalid payment intenet" },
          { status: 400 }
        );
      }
      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    // if we dont have payment inten id
    // create intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    // create order
    orderData.paymentIntentId = paymentIntent.id;
    await prisma.order.create({
      data: orderData,
    });
    return NextResponse.json({ paymentIntent });
  }
  // return a default reponse if none of conditions  valid
  return NextResponse.error()
}




// import Stripe from "stripe";
// import prisma from "@/libs/prismadb";
// import { NextResponse } from "next/server";
// import getCurrentUser  from "@/actions/getCurrentUser";
// import { CartProductType } from "@/types";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2023-10-16",
// });

// const calculateOrderAmount = (items: CartProductType[]): number => {
//   const totalPrice = items.reduce((acc, item) => {
//     const itemTotal = item.price * item.quantity;
//     return acc + itemTotal;
//   }, 0);
//   const price: any = Math.floor(totalPrice);
//   return price;
// };

// export async function POST(request: Request) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body = await request.json();
//   const { items, payment_intent_id } = body;
//   const total = Math.round(calculateOrderAmount(items) * 100);

//   if (payment_intent_id) {
//     const current_intent = await stripe.paymentIntents.retrieve(
//       payment_intent_id
//     );
// // *******************$errorv is here creation de payment 2 fois
//     if (current_intent) {
//       const updated_intent = await stripe.paymentIntents.update(
//         payment_intent_id,
//         { amount: total }
//       );

//       // Update the order using update_order
//       const updated_order = await prisma.order.update({
//         where: { paymentIntentId: payment_intent_id },
//         data: {
//           amount: total,
//           products: items,
//         },
//       });

//       if (!updated_order) {
//         return NextResponse.json(
//           { error: "Invalid payment intent" },
//           { status: 400 }
//         );
//       }

//       return NextResponse.json({ paymentIntent: updated_intent });
//     }
//   } else {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     const orderData = {
//       user: { connect: { id: currentUser.id } },
//       amount: total,
//       currency: "usd",
//       status: "pending",
//       deliveryStatus: "pending",
//       paymentIntentId: paymentIntent.id,
//       products: items,
//     };

//     await prisma.order.create({
//       data: orderData,
//     });

//     return NextResponse.json({ paymentIntent });
//   }

//   return NextResponse.error();
// }
