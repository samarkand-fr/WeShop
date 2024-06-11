"use client"
// Import necessary modules and components
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { SafeUser } from "@/types";
import { Rating } from "@mui/material";
import { Order, Product, Review } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Define the AddRating component
interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null
    | undefined;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);

  // Next.js router instance
  const router = useRouter();

  // React Hook Form instance
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  // Helper function to set custom value in React Hook Form
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Submit handler for the form
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    // Save the data in the database
    if (data.rating === 0) {
      setIsLoading(false);
      return toast.error("No Rating selected");
    }

    const ratingData = {
      ...data,
      userId: user?.id,
      product: product,
    };

    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Rating submitted");
        router.refresh();
        reset();
      })
      .catch((error: any) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Check if user and product exist, otherwise return null
  if (!user || !product) return null;

  // Check if the order has been delivered and if the user has already reviewed the product
  const deliveredOrder = user?.orders.some(
    (order) =>
      order.products.find((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered"
  );
  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === user.id;
  });

  // If the user has already reviewed the product or the order is not delivered, return null
  if (userReview || !deliveredOrder) return null;

  // Render the AddRating component
  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate this product" />
      <Rating
        onChange={(event, newValue) => {
          setCustomValue("rating", newValue);
        }}
      />
      <Input
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading" : "Rate Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

// Export the AddRating component
export default AddRating;
