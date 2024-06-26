// Importing necessary dependencies and types.
"use client";
import { SetColorProps } from "@/types";
import { border } from "@mui/system";

// SetColor component represents a section for selecting colors.
const SetColor: React.FC<SetColorProps> = ({
  images,
  cartProduct,
  handleColorSelect,
}) => {
  return (
    // Container for color selection section.
    <div className="flex gap-4 items-center">
      {/* Label for color selection */}
      <span className="font-semibold">COLOR :</span>
      {/* Container for displaying different colors available */}
      <div className="flex gap-1">
        {/* Mapping through color images for selection */}
        {images.map((image) => {
          return (
            <div
              key={image.color}
              onClick={() => handleColorSelect(image)}
              className={`h-7 w-7 rounded-full
                     border-teal-300 flex items-center justify-center
                     ${
                       cartProduct.selectedImg.color === image.color
                         ? "border-[1.5px]"
                         : "border-none"
                     }
                     `}
            >
              {/* Inner container displaying the color */}
              <div
                style={{ background: image.colorCode }}
                className="h-5 w-5 rounded-full border-[1.2] border-slate-300 cursor-pointer"
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetColor;
