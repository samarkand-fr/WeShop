import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

const DELIVERY_STATUSES = ["pending", "dispatched", "delivered"] as const;

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, deliveryStatus } = body ?? {};

    if (
      typeof id !== "string" ||
      !DELIVERY_STATUSES.includes(deliveryStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid order ID or delivery status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { deliveryStatus },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Unable to update delivery status:", error);
    return NextResponse.json(
      { error: "Unable to update order" },
      { status: 500 }
    );
  }
}
