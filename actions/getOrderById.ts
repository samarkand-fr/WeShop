import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

interface IParams {
  orderId?: string;
}

export default async function getOrderById(params: IParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !params.orderId) return null;

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) return null;
    if (currentUser.role !== "ADMIN" && order.userId !== currentUser.id) {
      return null;
    }

    return order;
  } catch (error) {
    console.error("Unable to fetch order:", error);
    return null;
  }
}
