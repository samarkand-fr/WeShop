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
  const router = useRouter();
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  const productRating = reviews.length
    ? reviews.reduce(
        (total: number, review: any) => total + review.rating,
        0
      ) / reviews.length
    : 0;
  const productImage = data.images?.[0]?.image;

  return (
    <button
      type="button"
      onClick={() => router.push(`/product/${data.id}`)}
      aria-label={`View ${data.name}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50">
        {productImage ? (
          <Image
            src={productImage}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-3 transition duration-300 group-hover:scale-105"
            alt={data.name}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Image unavailable
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="line-clamp-2 min-h-10 text-sm font-medium text-slate-800">
          {trancateText(data.name)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Rating value={productRating} precision={0.5} readOnly size="small" />
          <span className="text-xs text-slate-500">
            {reviews.length ? `(${reviews.length})` : "No reviews yet"}
          </span>
        </div>
        <p className="mt-3 text-base font-semibold text-slate-950">
          {formatPrice(data.price)}
        </p>
      </div>
    </button>
  );
};

export default ProductCard;
