import prisma from "@/libs/prismadb";

export interface IProductsParams {
  category?: string | null;
  searchTerm?: string | null;
}

export default async function getProducts(params: IProductsParams = {}) {
  try {
    const { category, searchTerm } = params;
    const normalizedSearch = searchTerm?.trim();

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(normalizedSearch
          ? {
              OR: [
                { name: { contains: normalizedSearch, mode: "insensitive" } },
                {
                  description: {
                    contains: normalizedSearch,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    contains: normalizedSearch,
                    mode: "insensitive",
                  },
                },
                { brand: { contains: normalizedSearch, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        reviews: {
          include: { user: true },
          orderBy: { createdDate: "desc" },
        },
      },
    });

    return products;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw new Error("An error occurred while fetching products.");
  }
}
