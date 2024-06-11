// Import necessary modules and dependencies
import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';

// Handle the PUT request for updating the deliveryStatus of an order
export async function PUT(request: Request) {
    // Get the current user using the getCurrentUser function
    const currentUser = await getCurrentUser();

    // Check if the user does not exist or is not an admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.error();
    }

    // Parse the request body
    const body = await request.json();
    const { id, deliveryStatus } = body;

    // Update the deliveryStatus of the order in the database
    const order = await prisma.order.update({
        where: {
            id: id,
        },
        data: {
            deliveryStatus,
        },
    });

    // Return the updated order as JSON response
    return NextResponse.json(order);
}
