import  prisma from "@/libs/prismadb";

export interface IProductsParams{
    category?: string | null;
    searchTerm ? : string | null
}

export default async function getProducts(params:IProductsParams) {
    try {
        // get products from our params 
        const { category, searchTerm } = params
        let searchSrting = searchTerm || ''
        let query:any = {}
        if (category) {
            query.category = category
        }
        const products = await prisma.product.findMany({
            where: {
                ...query,
                // search method for products
                OR: [
                    {
                        name: {
                            contains: searchSrting,
                            mode : 'insensitive'
                        },
                        description: {
                            contains: searchSrting,
                            mode : 'insensitive'
                        },
                        category: {
                            contains: searchSrting,
                            mode:'insensitive'
                        },
                        brand: {
                            contains: searchSrting,
                            mode:'insensitive'
                        },
                    }
                ]
            },
            include: {
                reviews: {
                    include: {
                        user : true
                    },
                    orderBy: {
                        createdDate : 'desc'
                    }
                }
            }
})

return products

} catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error('An error occurred while fetching products.');
}

}