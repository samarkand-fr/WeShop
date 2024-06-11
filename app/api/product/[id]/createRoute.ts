// create.ts
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    // Check if the user exists and is an admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.error();
    }

    const body = await request.json();
    const { name, description, price, brand, category, inStock, images } = body;

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

    return NextResponse.json(product);
}
