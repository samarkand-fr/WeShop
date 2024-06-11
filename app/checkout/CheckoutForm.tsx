// Import necessary modules and components
"use client";
import { useCart } from "@/hooks/useCart";
import {
  PaymentElement,
  useElements,
  useStripe,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/formatPrice";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import Button from "../components/Button";

// Define the props for the CheckoutForm component
interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

// CheckoutForm component for handling the payment form
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  // Destructure values from the cart context using useCart hook
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    // Check if Stripe and client secret are available
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    // Set payment success to false when the component mounts
    handleSetPaymentSuccess(false);
  }, [stripe, clientSecret, handleSetPaymentSuccess]);

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if Stripe and Elements are available
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    // Confirm the payment using Stripe
    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        // If the payment is successful, show success message and clear the cart
        if (!result.error) {
          toast.success("Checkout succeeded");
          handleClearCart();
          handleSetPaymentSuccess(true);
          handleSetPaymentIntent(null);
        }
        setIsLoading(false);
      });
  };

  return (
    // Payment form JSX
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        {/* Heading for the payment form */}
        <Heading title="Enter your payment details to complete checkout" />
      </div>
      <h2 className="font-semibold mt-4 mb-2"> Address Information</h2>
      {/* AddressElement for collecting shipping address information */}
      <AddressElement
        options={{
          mode: "shipping",
          allowedCountries: ["US", "FR"],
        }}
      />
      <h2 className="font-semibold mt-4 mb-2"> Payment Information</h2>
      {/* PaymentElement for collecting payment information */}
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <div className="py-4 text-center text-slate-700 text-4xl font-bold">
        {/* Display the total amount */}
        Total : {formattedPrice}
      </div>
      {/* Button for submitting the form */}
      <Button
        label={isLoading ? "Processing" : "Pay Now"}
        disabled={isLoading || !stripe || !elements}
        onClick={() => {}}
      />
    </form>
  );
};

// Export the CheckoutForm component
export default CheckoutForm;
