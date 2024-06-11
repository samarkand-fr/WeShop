// Importing necessary dependencies and types.
"use client";
import { CartProductType, SelectedImgType } from "@/types";
import Image from "next/image";

// Interface defining the props for the ProductImage component.
interface ProductImageProps {
  carteProduct: CartProductType; // The selected product in the cart.
  product: any; // The product data containing images.
  handleColorSelect: (value: SelectedImgType) => void; // Callback function to handle color selection.
}

// ProductImage component represents a grid of product images and the selected product image.
const ProductImage: React.FC<ProductImageProps> = ({
  carteProduct,
  product,
  handleColorSelect,
}) => {
  return (
    // Grid container for product images and selected image.
    <div
      className="grid grid-cols-6 gap-2 h-full max-h-[500px]
    min-h-[300px] sm:min-h-[400px]"
    >
      {/* Container for selectable color images */}
      <div
        className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px]
    min-h-[300px] sm:min-h-[400px]"
      >
        {/* Mapping through product images for color selection */}
        {product.images.map((image: SelectedImgType) => {
          return (
            <div
              key={product.image}
              onClick={() => handleColorSelect(image)}
              className={`relative w-[80%] aspect-square rounded border-teal-300
            ${
              carteProduct.selectedImg.color === image.color
                ? "border-[1.5px]"
                : "border-none"
            }`}
            >
              {/* Displaying the color image */}
              <Image
                src={image.image}
                alt={image.color}
                fill
                className="object-contain"
              />
            </div>
          );
        })}
      </div>
      {/* Container for the selected product image */}
      <div className="col-span-5 relative aspect-square">
        {/* Displaying the selected product image */}
        <Image
          className="w-full h-full object-contain "
          fill
          src={carteProduct.selectedImg.image}
          alt={carteProduct.name}
        />
      </div>
    </div>
  );
};

export default ProductImage;
