"use client";
import Link from "next/link";
import Image from "next/image";
import { CartProductType } from "../../types";
import { formatPrice } from "../../utils/formatPrice";
import { trancateText } from "../../utils/trancateText";
import SetQuantity from "../components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";

interface ItemContentProps {
  item: CartProductType;
}
const ItemContent: React.FC<ItemContentProps> = ({ item }) => {
  const { handleRemoveProductFromCart } = useCart();
  const { handleQtyIncrease } = useCart();
  const { handleQtyDecrease } = useCart();
  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className=" col-span-2 justify-self-start flex gap-2 md:gap-4">
        {/* a clickable image in cart items to see details */}
        <Link href={`/product/${item.id}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/product/${item.id}`}>{trancateText(item.name)}</Link>
          <div>{item.selectedImg.color}</div>
          <div className="w-[70px]">
            <button
              className=" text-slate-500 underline"
              onClick={() => handleRemoveProductFromCart(item)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className=" justify-self-center">{formatPrice(item.price)}</div>
      <div className=" justify-self-center">
        <SetQuantity
          cartCounter
          cartProduct={item}
          handleQtyIncrease={() => {
            handleQtyIncrease(item);
          }}
          handleQtyDecrease={() => {
            handleQtyDecrease(item);
          }}
        />
      </div>
      <div className=" justify-self-end font-semibold">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default ItemContent;
