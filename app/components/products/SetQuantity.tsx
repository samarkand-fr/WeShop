"use client";

import { CartProductType } from "@/types";

interface SetQtypRops {
  // ? to decide in which component is rendered
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}
const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded";
const SetQuantity: React.FC<SetQtypRops> = ({
  cartCounter,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    <div className="flex gap-8 item-center">
      {/* add a div dynamically whether we are in cart or in product page */}
      {cartCounter ? " " : <div className="font-semibold"> QUANTITY: </div>}
      <div className="flex gap-4 items-center text-base">
        <button className={btnStyles} onClick={handleQtyDecrease}>
          -
        </button>
        <div>{cartProduct.quantity}</div>
        <button className={btnStyles} onClick={handleQtyIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
