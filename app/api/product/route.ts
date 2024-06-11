import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

// Create a New Product (POST Request):
export async function POST(request: Request) {
  // Get the current user using the getCurrentUser function
  const currentUser = await getCurrentUser();

  // Check if the user does not exist or is not an admin
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  // Parse the request body for product details
  const body = await request.json();
  const { name, description, price, brand, category, inStock, images } = body;

  // Create a new product in the database
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      brand,
      category,
      inStock,
      images,
    },
  });

  // Return the created product as JSON response
  return NextResponse.json(product);
}

// Update Product In-Stock Quantity (PUT Request):
export async function PUT(request: Request) {
  // Get the current user using the getCurrentUser function
  const currentUser = await getCurrentUser();

  // Check if the user does not exist or is not an admin
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.error();
  }

  // Parse the request body for product update details
  const body = await request.json();
  const { id, inStock } = body;

  // Update the inStock quantity of the product in the database
  const product = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      inStock,
    },
  });

  // Return the updated product as JSON response
  return NextResponse.json(product);
}
