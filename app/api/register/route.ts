import bcrypt from 'bcrypt';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';

// Handle the POST request to register a new user
export async function POST(request: Request) {
    // Parse the JSON body from the request
    const body = await request.json();
    const { name, email, password } = body;

    // Hash the user's password using bcrypt with a cost factor of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using Prisma with the hashed password
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    });

    // Return a JSON response with the created user
    return NextResponse.json(user);
}
