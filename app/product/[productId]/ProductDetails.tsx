"use client"
// Import necessary dependencies and components
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

// Interface for props received by ProductDetails component
interface ProducDetailsProps {
  product: any;
}

//  Reusable component used for horizontal lines
const Horizantal = () => {
  return <hr className="w-[30%] my-2" />;
};

// ProductDetails component definition
const ProductDetails: React.FC<ProducDetailsProps> = ({ product }) => {
  // Destructuring properties from the useCart hook
  const { handleAddProductToCart, cartProducts } = useCart();

  // State variables for managing product in cart status and cart product details
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price,
  });

  // Next.js router instance
  const router = useRouter();

  // Effect to check if the product is already in the cart
  useEffect(() => {
    setIsProductInCart(false);

    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );

      // Check if the product exists in the cart
      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts, product.id]);

  // Calculate the average rating of the product based on reviews
  const productRating = product.reviews.length
    ? product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length
    : 0;

  // Handle color selection callback
  const handleColorSelect = useCallback((value: SelectedImgType) => {
    // Set the selected image for the cart product
    setCartProduct((prev) => ({ ...prev, selectedImg: value }));
  }, []);

  // Handle quantity increase callback
  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 99) {
      return;
    }

    setCartProduct((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  }, [cartProduct]);

  // Handle quantity decrease callback
  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }

    setCartProduct((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
  }, [cartProduct]);

  // Handle add to cart button click
  const handleAddToCart = () => {
    handleAddProductToCart(cartProduct);
  };

  // Render ProductDetails component
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
        {/* Additional product details */}
        <div>
          <span className="font-semibold">CATEGORY:</span> {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND: </span> {product.brand}
        </div>
        {/* Display stock status */}
        <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
          {product.inStock ? "In Stock" : "Out Of Stock"}
        </div>
        <Horizantal />
        {/* Check if the product is in the cart */}
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdChangeCircle size={20} className="text-teal-400" />
              <span>Product added to cart</span>
            </p>
            <div className="max-w-[300px]">
              {/* View cart button */}
              <Button
                label="View Cart"
                outline
                onClick={() => {
                  router.push("/cart");
                }}
              />
            </div>
          </>
        ) : (
          <>
            {/* Render SetColor component for color selection */}
            <SetColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />
            <Horizantal />
            {/* Render SetQuantity component for quantity selection */}
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Horizantal />
            {/* Add to cart button */}
            <div className="max-w-[300px]">
              <Button label="Add to Cart" onClick={handleAddToCart} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
