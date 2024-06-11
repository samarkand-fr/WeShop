// Import necessary modules and types.
import { CartProductType } from "@/types";
import Image from "next/image";
import { trancateText } from "@/utils/trancateText";
import { formatPrice } from "@/utils/formatPrice";

// Define the OrderItemProps interface.
interface OrderItemProps {
  item: CartProductType;
}

// Define the OrderItem component.
const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  return (
    <div
      className="grid grid-cols-5 text-xs md:text-sm gap-4 
      border-t-[1.5px] border-slate-200 py-4 items-center"
    >
      {/* Product image and details */}
      <div className="col col-span-2 justify-self-start flex gap-2 md:gap-4">
        <div className="relative w-[70px] aspect-square">
          {/* Display the product image */}
          <Image
            src={item.selectedImg.image}
            alt={item.name}
            className="object-contain"
            fill
          />
        </div>
        <div className="flex flex-col gap-1">
          {/* Display the product name and color */}
          <div>{trancateText(item.name)}</div>
          <div>{item.selectedImg.color}</div>
        </div>
      </div>
      {/* Product price, quantity, and total amount */}
      <div className="justify-self-center">{formatPrice(item.price)}</div>
      <div className="justify-self-center">{item.quantity}</div>
      <div className="justify-self-last font-semibold">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

// Export the OrderItem component.
export default OrderItem;
