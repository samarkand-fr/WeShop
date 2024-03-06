"use client";

import { formatPrice } from "@/utils/formatPrice";
import { trancateText } from "@/utils/trancateText";
import Image from "next/image";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  data: any;
}
const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  // make the routes dynamic by using userouter hook to navigate to it
  // provoke it to use the router
  const router = useRouter();

  // calculate rating from data
  const productRating =
    data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    data.reviews.length;

  return (
    // use the router to navigate on clicking on a card
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1.2px]
           border-slate-100 bg-slate-50 rounded-sm p-2 
           transition hover:scale-105 text-center text-sm"
    >
      <div>
        <div className="flex flex-col w-full gap-1"></div>
        <div className="aspect-square overflow-hidden relative w-full">
          <Image
            src={data.images[0].image}
            fill
            className="w-full h-full object-contain"
            alt="card-image"
          />
        </div>
        <div className="mt-4">{trancateText(data.name)}</div>
        <div>
          <Rating value={productRating} readOnly />
        </div>
        <div>{data.reviews.length} reviews</div>
        <div className="font-semibold ">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
