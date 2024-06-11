"use client"
// Importing necessary hooks and components for the CartCount component.
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci";

// CartCount component displays the total quantity of items in the shopping cart.
const CartCount = () => {
  // Using the useCart hook to get the total quantity of items in the cart.
  const { cartTotalQty } = useCart();
  
  // Router hook to enable navigation to another page.
  const router = useRouter();

  return (
    // Container for the shopping cart icon, allowing navigation to the cart page on click.
    <div
      className="relative cursor-pointer"
      onClick={() => {
        router.push("/cart");
      }}
    >
      {/* Shopping cart icon with a hover effect and transition. */}
      <div className="text-4xl  hover:text-pink-600 transition ">
        <CiShoppingCart />
        {/* Displaying the total quantity as a badge if it is greater than 0. */}
        {cartTotalQty > 0 && (
          <span className="absolute top-[-10px] right-[-10px] text-white bg-pink-600 h-6 w-6 rounded-full flex items-center justify-center text-sm">
            {cartTotalQty}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartCount;
