"use client";

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

interface AddRatingProps {
  product: Product & { reviews: Review[] };
  user: (SafeUser & { orders: Order[] }) | null | undefined;
}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { comment: "", rating: 0 },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const rating = Number(data.rating);
    const comment = String(data.comment ?? "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5");
      return;
    }
    if (!comment) {
      toast.error("Please write a comment");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/rating", {
        productId: product.id,
        rating,
        comment,
      });
      toast.success("Review submitted");
      router.refresh();
      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ?? "Unable to submit your review"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !product) return null;

  const deliveredOrder = user.orders.some(
    (order) =>
      order.products.some((item) => item.id === product.id) &&
      order.deliveryStatus === "delivered" &&
      order.status === "complete"
  );
  const userReview = product.reviews.some(
    (review) => review.userId === user.id
  );

  if (userReview || !deliveredOrder) return null;

  return (
    <div className="flex max-w-[500px] flex-col gap-2">
      <Heading title="Rate this product" />
      <Rating
        onChange={(_, newValue) =>
          setValue("rating", newValue ?? 0, {
            shouldTouch: true,
            shouldDirty: true,
            shouldValidate: true,
          })
        }
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
        label={isLoading ? "Submitting..." : "Rate Product"}
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default AddRating;
