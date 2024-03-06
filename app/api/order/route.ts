
import getCurrentUser from '@/actions/getCurrentUser';
import  prisma  from '@/libs/prismadb';
import { NextResponse } from 'next/server';

// may be here post***************************
// rest a faire call this api to add product 
export async function PUT (request :Request) {
    const currentUser = await getCurrentUser()
    // check if not user exist or not admin 
    if (!currentUser) return NextResponse.error()
    if (currentUser.role !== 'ADMIN') {
        return NextResponse.error()
    }
    const body = await request.json()
    const { id, deliveryStatus } = body
    
    const order = await prisma.order.update({
        where: {
            id:id,
        },
        data: {deliveryStatus},
    })
    return NextResponse.json(order)
}

