"use client";

import { useCart } from "@/hooks/useCart";
import { Elements, StripeElementsOptions } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!cartProducts?.length) {
      setClientSecret("");
      return;
    }

    const controller = new AbortController();

    const initializeCheckout = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            items: cartProducts,
            payment_intent_id: paymentIntent,
          }),
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "Unable to initialize checkout");
        }
        if (!data?.paymentIntent?.client_secret || !data?.paymentIntent?.id) {
          throw new Error("The payment provider returned an invalid response");
        }

        setClientSecret(data.paymentIntent.client_secret);
        handleSetPaymentIntent(data.paymentIntent.id);
      } catch (checkoutError) {
        if (controller.signal.aborted) return;
        console.error("Checkout initialization failed:", checkoutError);
        const message =
          checkoutError instanceof Error
            ? checkoutError.message
            : "Something went wrong while preparing checkout";
        setError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    initializeCheckout();
    return () => controller.abort();
  }, [cartProducts, paymentIntent, handleSetPaymentIntent, router, retryKey]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full">
      {clientSecret && cartProducts?.length ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      ) : null}

      {loading && (
        <p role="status" className="py-8 text-center text-slate-500">
          Preparing secure checkout...
        </p>
      )}

      {error && (
        <div role="alert" className="space-y-3 rounded-lg bg-rose-50 p-4 text-center text-rose-700">
          <p>{error}</p>
          <Button
            label="Try again"
            onClick={() => {
              setError(null);
              setClientSecret("");
              setRetryKey((value) => value + 1);
            }}
          />
        </div>
      )}

      {!loading && !error && !cartProducts?.length && !paymentSuccess && (
        <div className="space-y-4 py-10 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Button label="Continue shopping" onClick={() => router.push("/")} />
        </div>
      )}

      {paymentSuccess && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-center font-semibold text-teal-600">
            Payment successful. Thank you for your order!
          </p>
          <div className="w-full max-w-[240px]">
            <Button
              label="View your orders"
              onClick={() => router.push("/orders")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
