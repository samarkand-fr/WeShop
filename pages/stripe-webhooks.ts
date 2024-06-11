// Import required modules and libraries
import { buffer } from "micro"
import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

// Configuration for the API endpoint
export const config = {
    api: {
        bodyParser: false
    }
}

// Create a new instance of the Stripe SDK with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16'
})

// Define the webhook handler function
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Read the request body into a buffer
    const buf = await buffer(req)

    // Retrieve the Stripe signature from the request headers
    const signature = req.headers['stripe-signature']

    // Check if the Stripe signature is missing
    if (!signature) {
        return res.status(400).send("Missing Stripe Signature")
    }

    let event: Stripe.Event

    try {
        // Verify the Stripe webhook signature and parse the event
        event = stripe.webhooks.constructEvent(
            buf,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        // Handle webhook verification or parsing errors
        return res.status(400).send("Webhook error: " + error)
    }

    // Handle different types of Stripe webhook events
    switch (event.type) {
        case 'charge.succeeded':
            // Extract charge details from the event
            const charge: any = event.data.object as Stripe.Charge

            // Check if the payment_intent is a string
            if (typeof charge.payment_intent === 'string') {
                // Update the order status to 'complete' and store shipping address
                await prisma?.order.update({
                    where: {
                        paymentIntentId: charge.payment_intent
                    },
                    data: {
                        status: 'complete',
                        address: charge.shipping?.address
                    }
                })
            }
            break
        default:
            // Log unhandled event types
            console.log('Unhandled event type: ' + event.type)
    }

    // Respond with a JSON indicating the webhook was received
    res.json({ received: true })
}
