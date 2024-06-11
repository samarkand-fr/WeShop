// Importing necessary dependencies and types.
"use client";
import { CartProductType } from "@/types";

// Interface defining the props for the SetQuantity component.
interface SetQtypRops {
  cartCounter?: boolean; // Flag to decide in which component is rendered.
  cartProduct: CartProductType; // The cart product data.
  handleQtyIncrease: () => void; // Callback function to handle quantity increase.
  handleQtyDecrease: () => void; // Callback function to handle quantity decrease.
}

// Common button styles for quantity buttons.
const btnStyles = "border-[1.2px] border-slate-300 px-2 rounded";

// SetQuantity component represents a section for setting the quantity.
const SetQuantity: React.FC<SetQtypRops> = ({
  cartCounter,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    // Container for the quantity section.
    <div className="flex gap-8 item-center">
      {/* Conditional rendering of the label based on the component type */}
      {cartCounter ? " " : <div className="font-semibold"> QUANTITY: </div>}
      {/* Container for quantity buttons and display */}
      <div className="flex gap-4 items-center text-base">
        {/* Button to decrease quantity */}
        <button className={btnStyles} onClick={handleQtyDecrease}>
          -
        </button>
        {/* Displaying the current quantity */}
        <div>{cartProduct.quantity}</div>
        {/* Button to increase quantity */}
        <button className={btnStyles} onClick={handleQtyIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
