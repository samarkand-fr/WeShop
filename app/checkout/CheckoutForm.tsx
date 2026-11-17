"use client";

import { useCart } from "@/hooks/useCart";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import toast from "react-hot-toast";
import Heading from "../components/Heading";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (stripe && clientSecret) handleSetPaymentSuccess(false);
  }, [stripe, clientSecret, handleSetPaymentSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || isLoading) return;

    setIsLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message ?? "Your payment could not be completed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        toast.success("Payment completed successfully");
        handleClearCart();
        handleSetPaymentIntent(null);
        handleSetPaymentSuccess(true);
      } else if (paymentIntent?.status === "processing") {
        toast("Your payment is processing. You can check your orders shortly.");
      } else {
        toast.error("Payment has not been completed. Please try again.");
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      toast.error("An unexpected error occurred while processing payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form" className="space-y-5">
      <div className="mb-6">
        <Heading title="Enter your payment details to complete checkout" />
      </div>

      <section>
        <h2 className="mb-2 mt-4 font-semibold">Shipping address</h2>
        <AddressElement
          options={{
            mode: "shipping",
            allowedCountries: ["US", "FR"],
          }}
        />
      </section>

      <section>
        <h2 className="mb-2 mt-4 font-semibold">Payment information</h2>
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </section>

      <div className="py-4 text-center text-2xl font-bold text-slate-800 sm:text-4xl">
        Total: {formatPrice(cartTotalAmount)}
      </div>

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Processing payment..." : "Pay now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
