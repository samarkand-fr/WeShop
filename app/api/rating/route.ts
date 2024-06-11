import getCurrentUser from "@/actions/getCurrentUser";
import { Review } from "@prisma/client";
import { NextResponse } from "next/server";

// Handle the POST request to create a new review
export async function POST(request: Request) {
  // Get the current user
  const currentUser = await getCurrentUser();

  // Check if there is no current user, return an error response
  if (!currentUser) return NextResponse.error();

  // Parse the JSON body from the request
  const body = await request.json();
  
  // Destructure the required properties from the request body
  const { comment, rating, product, userId } = body;

  // Check if the user has a delivered order for the specified product
  const deliveredOrder = currentUser?.orders.some(
    (order) =>
      order.products.find((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );

  // Check if the user has already reviewed the product or the order is not delivered
  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === currentUser.id;
  });

  if (userReview || !deliveredOrder) {
    // If the user has already reviewed the product or the order is not delivered, return an error response
    return NextResponse.error();
  }

  // Create a new review using Prisma
  const review = await prisma?.review.create({
    data: {
      comment,
      rating,
      productId: product.id,
      userId,
    },
  });

  // Return a JSON response with the created review
  return NextResponse.json(review);
}
