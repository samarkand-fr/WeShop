"use client";

import { Rating } from "@mui/material";
import { CartProductType, SelectedImgType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import SetColor from "../../components/products/SetColor";
import SetQuantity from "../../components/products/SetQuantity";
import Button from "../../components/Button";
import ProductImage from "../../components/products/ProductImage";
import { useCart } from "@/hooks/useCart";
import { MdChangeCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ProducDetailsProps {
  product: any;
}

//  reusable component  used between different sections(a line)
const Horizantal = () => {
  return <hr className="w-[30%] my-2" />;
};

const ProductDetails: React.FC<ProducDetailsProps> = ({ product }) => {
  const { handleAddProductToCart, cartProducts } = useCart();
  const [isproductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    // reseting the values
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1, //in case we dont have value
    price: product.price,
  });

  const router = useRouter();
  console.log(cartProducts);

  useEffect(() => {
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );

      // ckeck if product exist by referring to its index
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts, product.id]);

  // calculate rating from data
  const productRating =
    product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product.reviews.length;

  const handleColorSelect = useCallback(
    (value: SelectedImgType) => {
      //  mark the selected image by the new state value
      setCartProduct((prev) => {
        return { ...prev, selectedImg: value };
      });
    },
    []
  );

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 99) {
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [cartProduct]);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [cartProduct]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        carteProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="font-medium text-2xl text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <Horizantal />
        <div className="text-justify">{product.description}</div>
        <Horizantal />
        <div>
          <span className="font-semibold">CATEGORY:</span> {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND: </span> {product.brand}
        </div>
        <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
          {product.inStock ? "In Stock" : "Out Of Stock"}
        </div>
        <Horizantal />
        {/* check if product in cart */}
        {isproductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdChangeCircle size={20} className="text-teal-400" />
              <span>product added to </span>
            </p>
            <div className="max-w-[300px]">
              <Button
                label="view cart"
                outline
                onClick={() => {
                  router.push("/cart");
                }}
              />
            </div>
          </>
        ) : (
          <>
            {/* render the setcolor component to be able to choose color  */}
            <SetColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />
            <Horizantal />
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Horizantal />
            <div className="max-w-[300px]">
              <Button
                label="add to cart"
                onClick={() => handleAddProductToCart(cartProduct)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
