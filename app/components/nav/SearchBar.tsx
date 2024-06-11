// Importing necessary dependencies.
"use client";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

// SearchBar component allows users to search for products.
const SearchBar = () => {
  // Router hook for navigation.
  const router = useRouter();

  // Form handling with react-hook-form.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      searchTerm: "",
    },
  });

  // Callback function for form submission.
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // If the search term is empty, navigate to the home page.
    if (!data.searchTerm) return router.push("/");

    // Constructing the URL with the search term using query-string.
    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: {
          searchTerm: data.searchTerm,
        },
      },
      {
        skipNull: true,
      }
    );

    // Navigating to the constructed URL and resetting the form.
    router.push(url);
    reset();
  };

  // Rendering the search input and button.
  return (
    <div className="flex items-center">
      {/* Search input field */}
      <input
        {...register("searchTerm")}
        autoComplete="off"
        type="text"
        placeholder="Search products..."
        className="p-2 border border-slate-300 rounded-l-md focus:outline-none focus:border-[0.5px] focus:border-slate-500 w-60 md:w-80"
      />
      {/* Search button */}
      <button
        onClick={handleSubmit(onSubmit)}
        className="bg-slate-600 hover:opacity-80 text-white p-2 rounded-r-md hover:bg-pink-600 transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
