"use client";

import { useRouter } from "next/navigation";
import queryString from "query-string";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const SearchBar = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { searchTerm: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const searchTerm = String(data.searchTerm ?? "").trim();
    if (!searchTerm) {
      router.push("/");
      return;
    }

    const url = queryString.stringifyUrl(
      { url: "/", query: { searchTerm } },
      { skipNull: true }
    );
    router.push(url);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="search" className="flex items-center">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        {...register("searchTerm")}
        autoComplete="off"
        type="search"
        placeholder="Search products..."
        className="w-40 rounded-l-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:w-60 md:w-72"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
