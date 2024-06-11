// Importing necessary dependencies and utilities.
"use client";
import { formatPrice } from "@/utils/formatPrice";
import { trancateText } from "@/utils/trancateText";
import Image from "next/image";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

// Interface defining the props for the ProductCard component.
interface ProductCardProps {
  data: any; // The product data to be displayed on the card.
}

// ProductCard component represents a card displaying product information.
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  // Router hook for navigation.
  const router = useRouter();

  // Calculate product rating based on reviews.
  const productRating =
    data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    data.reviews.length;

  return (
    // Container for the ProductCard with click event for navigation and styling.
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1.2px]
           border-slate-100 bg-slate-50 rounded-sm p-2 
           transition hover:scale-105 text-center text-sm"
    >
      {/* Container for the product information */}
      <div>
        <div className="flex flex-col w-full gap-1"></div>
        {/* Container for the product image */}
        <div className="aspect-square overflow-hidden relative w-full">
          {/* Displaying the product image using Next.js Image component */}
          <Image
            src={data.images[0].image}
            fill
            className="w-full h-full object-contain"
            alt="card-image"
          />
        </div>
        {/* Displaying the truncated product name */}
        <div className="mt-4">{trancateText(data.name)}</div>
        {/* Displaying the product rating */}
        <div>
          <Rating value={productRating} readOnly />
        </div>
        {/* Displaying the number of reviews */}
        <div>{data.reviews.length} reviews</div>
        {/* Displaying the formatted product price */}
        <div className="font-semibold ">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
