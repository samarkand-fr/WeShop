// Importing necessary dependencies and components.
"use client";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import queryString from "query-string";

// Interface defining the props for the Category component.
interface CategoryProps {
  label: string;
  icon: IconType;
  selected?: boolean;
}

// Category component displays a category with an icon and handles category selection.
const Category: React.FC<CategoryProps> = ({ label, icon: Icon, selected }) => {
  // Router hook for navigation.
  const router = useRouter();
  // Hook to access URL search parameters.
  const params = useSearchParams();

  // Callback function to handle category click and update the URL.
  const handleClick = useCallback(() => {
    if (label === "All") {
      // If 'All' is selected, navigate to the main page.
      router.push("/");
    } else {
      // If a specific category is selected, update the URL with the category parameter.
      let currentQuery = {};
      if (params) {
        // Use the query-string library to parse the current URL parameters.
        currentQuery = queryString.parse(params.toString());
      }
      const updatedQuery: any = {
        ...currentQuery,
        category: label,
      };
      // Construct the updated URL using query-string.
      const url = queryString.stringifyUrl(
        {
          url: "/",
          query: updatedQuery,
        },
        {
          skipNull: true,
        }
      );
      // Navigate to the updated URL.
      router.push(url);
    }
  }, [label, params, router]);

  return (
    // Container for the category with click event and styling based on selection.
    <div
      onClick={handleClick}
      className={`flex items-center justify-center text-center
      gap-1 p-2 border-b-2 hover:text-pink-800 transition cursor-pointer
      ${selected ? "border-b-slate-800 text-slate-800" : "border-transparent text-slate-500"}
      `}
    >
      {/* Displaying the category icon. */}
      <Icon size={20} className="text-pink-800" />
      {/* Displaying the category label. */}
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default Category;
