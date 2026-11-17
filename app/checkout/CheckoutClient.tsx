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
  const { cartProducts, paymentIntent, handleSetPaymentIntent, handleClearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const redirectedClientSecret = new URLSearchParams(
      window.location.search
    ).get("payment_intent_client_secret");
    if (!redirectedClientSecret) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const verifyRedirectedPayment = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Unable to connect to the payment provider");

        const { paymentIntent: returnedIntent, error: stripeError } =
          await stripe.retrievePaymentIntent(redirectedClientSecret);

        if (cancelled) return;
        if (stripeError) {
          throw new Error(
            stripeError.message ?? "Unable to verify your payment"
          );
        }

        if (returnedIntent?.status === "succeeded") {
          handleClearCart();
          handleSetPaymentIntent(null);
          setPaymentSuccess(true);
          toast.success("Payment completed successfully");
        } else if (returnedIntent?.status === "processing") {
          setPaymentProcessing(true);
          toast("Your payment is still processing. Check your orders shortly.");
        } else {
          setError("The payment was not completed. Please try again.");
        }
      } catch (verificationError) {
        if (cancelled) return;
        const message =
          verificationError instanceof Error
            ? verificationError.message
            : "Unable to verify your payment";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    verifyRedirectedPayment();
    return () => {
      cancelled = true;
    };
  }, [handleClearCart, handleSetPaymentIntent]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("payment_intent_client_secret")) return;
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

      {paymentProcessing && !paymentSuccess && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-center font-semibold text-amber-600">
            Your payment is processing. You can check your order status shortly.
          </p>
          <div className="w-full max-w-[240px]">
            <Button label="View your orders" onClick={() => router.push("/orders")} />
          </div>
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
