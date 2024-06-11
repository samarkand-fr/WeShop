"use client"
// Importing IconType from react-icons for dynamic icons.
import { IconType } from "react-icons";

// Interface defining the props for the CategoryInput component.
interface CategoryInputProps {
  selected?: boolean;            // Indicates whether the category is selected.
  label: string;                  // Label for the category.
  icon: IconType;                 // Icon component for the category.
  onclick: (value: string) => void; // Callback function when the category is clicked.
}

// CategoryInput component represents a selectable category input with label and icon.
const CategoryInput: React.FC<CategoryInputProps> = ({
  selected,
  label,
  icon: Icon,
  onclick,
}) => {
  return (
    // Container for the category input with dynamic styling based on props.
    <div
      onClick={() => onclick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col 
             items-center gap-2 hover:border-slate-500 transition cursor-pointer
      ${selected ? "border-slate-500" : "border-slate-200"}`}
    >
      {/* Displaying the icon and label within the category input container. */}
      <Icon size={30} />
      <div className=" font-medium">{label}</div>
    </div>
  );
};

export default CategoryInput;
