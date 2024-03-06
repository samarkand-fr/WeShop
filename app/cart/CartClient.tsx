"use client";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../components/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "../../utils/formatPrice";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";

interface CartClientProps {
  currentUser: SafeUser | null | undefined;
}
const CartClient: React.FC<CartClientProps> = ({ currentUser }) => {
  // use hook destructure
  const { cartProducts, handleClearCart, cartTotalAmount } = useCart();
  const router = useRouter();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center ">
        <div className="text-2Xl">Your Cart is Empty</div>
        <div>
          <Link
            href={"./"}
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <Heading title="Shopping Cart" center />
      </div>
      <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
        <div className="col-span-2 justify-self-start">Product</div>
        <div className=" justify-self-center">Price</div>
        <div className=" justify-self-center">Quantity</div>
        <div className=" justify-self-end">Total</div>
      </div>
      <div>
        {/* map through products to place them in the cart  */}
        {cartProducts &&
          cartProducts.map((item) => {
            //    return <div key={item.id}>
            //          {item.name}
            //          </div>
            return <ItemContent key={item.id} item={item} />;
          })}
        <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
          <div className="w-[90px]">
            <Button
              label="Clear Cart"
              onClick={() => {
                handleClearCart();
              }}
              small
              outline
            />
          </div>
          <div className="text-sm flex flex-col items-start gap-1">
            <div className="flex justify-between w-full text-base font-semibold">
              <span className="">Subtotal</span>
              <span>{formatPrice(cartTotalAmount)}</span>
            </div>

            <p className=" text-slate-500">
              Taxes and shipping calculated at checkout
            </p>
            <Button
              label={currentUser ? "Checkout" : "Login to checkout"}
              outline={currentUser ? false : true}
              onClick={() => {
                currentUser ? router.push("/checkout") : router.push("/login");
              }}
            />

            <Link
              href={"/"}
              className="text-slate-500 flex items-center gap-1 mt-2"
            >
              <MdArrowBack />
              <span>continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartClient;
