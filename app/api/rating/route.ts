import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const productId = body?.productId;
    const rating = Number(body?.rating);
    const comment =
      typeof body?.comment === "string" ? body.comment.trim() : "";

    if (
      typeof productId !== "string" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      !comment ||
      comment.length > 1000
    ) {
      return NextResponse.json(
        { error: "Please provide a product, a rating from 1 to 5 and a valid comment." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const hasDeliveredOrder = currentUser.orders.some((order) =>
      order.products.some((item) => item.id === productId) &&
      order.deliveryStatus === "delivered" &&
      order.status === "complete"
    );

    if (!hasDeliveredOrder) {
      return NextResponse.json(
        { error: "You can review a product after its delivery" },
        { status: 403 }
      );
    }

    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: currentUser.id },
      select: { id: true },
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        productId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Unable to submit product review:", error);
    return NextResponse.json(
      { error: "Unable to submit your review" },
      { status: 500 }
    );
  }
}
