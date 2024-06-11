"use client"
// Import necessary types and hooks from React for the component.
import { ImageType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import SelectImage from "./SelectImage";
import Button from "../Button";

// Interface defining the props for the SelectColors component.
interface SelectColorsProps {
  item: ImageType;                                  // ImageType for the color item.
  addImageToState: (value: ImageType) => void;      // Function to add image to state.
  removeImageFromState: (value: ImageType) => void; // Function to remove image from state.
  isProductCreated: boolean;                         // Flag indicating whether the product is created.
}

// SelectColors component represents a color selection section with an associated image.
const SelectColors: React.FC<SelectColorsProps> = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
}) => {
  // State to track whether the color is selected and the associated image file.
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Effect to reset the component state when the product is created.
  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  // Callback to handle file change and add image to state.
  const handleFileChange = useCallback(
    (value: File) => {
      setFile(value);
      addImageToState({ ...item, image: value });
    },
    [item, addImageToState]
  );

  // Callback to handle checkbox change and toggle selection state.
  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked);
      if (!e.target.checked) {
        setFile(null);
        removeImageFromState(item);
      }
    },
    [item, removeImageFromState]
  );

  // Return JSX representing the SelectColors component.
  return (
    <div className="grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2">
      {/* Checkbox and label for color selection. */}
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <input
          id={item.color}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label htmlFor="item.color" className="font-medium cursor-pointer">
          {item.color}
        </label>
      </div>
      <>
        {/* Section for uploading image when color is selected. */}
        {isSelected && !file && (
          <div className="col-span-2 text-center">
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}
        {/* Display file name and cancel button when file is selected. */}
        {file && (
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
            <p>{file?.name}</p>
            <div className="w-[70px]">
              <Button
                label="Cancel"
                small
                outline
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SelectColors;
