import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Get the current user
  const currentUser = await getCurrentUser();
  
  // Check if the user does not exist or is not an admin
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return NextResponse.error();
  }

  // Extract the product ID from the request parameters
  const productId = params.id;

  try {
    // Use the `await` keyword to ensure the delete operation is completed before responding
    const deletedProduct = await prisma?.product.delete({
      where: {
        id: productId,
      },
    });

    // Respond with the deleted product
    return NextResponse.json(deletedProduct);
  } catch (error) {
    // Handle any errors that occur during the delete operation
    console.error("Error deleting product:", error);

    // Respond with an error
    return NextResponse.error();
  }
}
