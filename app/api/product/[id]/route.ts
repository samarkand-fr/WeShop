import getCurrentUser from "@/actions/getCurrentUser"
import { NextResponse } from "next/server"

export async function DELETE(request: Request,
    { params }: {params: {id: string}}) { 
    
        const currentUser = await getCurrentUser()
        // check if not user exist or not admin 
        if (!currentUser) return NextResponse.error()
        if (currentUser.role !== 'ADMIN') {
               return NextResponse.error()
           }
    
    const product = await prisma?.product.delete({
        where: {
            id : params.id
        }
    })
    return NextResponse.json(product)
}