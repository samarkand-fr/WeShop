"use client"
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import {CiShoppingCart} from "react-icons/ci"


const CartCount = () => {
    const {cartTotalQty}= useCart()
    // inorder to navigate to another page 
    const router = useRouter()
  return (
    <div className="relative cursor-pointer" 
      onClick={()=>{router.push('/cart')}}>

<div className="text-4xl  hover:text-pink-600 transition ">
    <CiShoppingCart />
        {/* <span className="absolute top-[-10px] right-[-10px]
     text-white bg-slate-700 h-6 w-6 rounded-full flex items-center justify-center text-sm">
          </span> */}
         {cartTotalQty > 0 && (
          <span className="absolute top-[-10px] right-[-10px] text-white bg-pink-600 h-6 w-6 rounded-full flex items-center justify-center text-sm">
            {cartTotalQty}
          </span>
        )}
</div>
    </div>
  )
}

export default CartCount

