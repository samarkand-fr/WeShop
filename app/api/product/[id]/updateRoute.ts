// update.ts
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function PUT(request: Request) {
    const currentUser = await getCurrentUser();

    // Check if the user exists and is an admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.error();
    }

    const body = await request.json();
    const { id, inStock } = body;

    const product = await prisma.product.update({
        where: {
            id: id,
        },
        data: { inStock },
    });

    return NextResponse.json(product);
}
