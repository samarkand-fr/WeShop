// Importing necessary dependencies and components.
"use client";
import { categories } from "@/utils/categories";
import Container from "../Container";
import Category from "./Category";
import { usePathname, useSearchParams } from "next/navigation";

// Categories component displays a list of categories.
const Categories = () => {
  // Getting the category parameter from the URL.
  const params = useSearchParams();
  const category = params?.get("category");

  // Getting the current pathname using the usePathname hook.
  const pathname = usePathname();

  // Checking if the current page is the main page.
  const isMainPage = pathname === "/";
  // Returning null if not on the main page.
  if (!isMainPage) return null;

  return (
    // Container for the category list with a white background.
    <div className="bg-white">
      {/* Container component for layout consistency. */}
      <Container>
        {/* Flex container with padding and flex properties. */}
        <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
          {/* Mapping through categories and rendering Category components. */}
          {categories.map((item) => (
            <Category
              key={item.label}
              label={item.label}
              icon={item.icon}
              // Checking if the category is selected based on the URL parameter.
              selected={
                category === item.label ||
                (category === null && item.label === "All")
              }
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
