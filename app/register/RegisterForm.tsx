"use client"
// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AiOutlineGoogle } from "react-icons/ai";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import Button from "../components/Button";
import Link from "next/link";
import { SafeUser } from "@/types";

// Define the props interface
interface RegisterFormProps {
  currentUser: SafeUser | null | undefined;
}

// RegisterForm component
const RegisterForm: React.FC<RegisterFormProps> = ({ currentUser }) => {
  // State to handle loading
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Next.js router
  const router = useRouter();

  // Effect to redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
    }
  }, [currentUser, router]);

  // Form submission handler
  const onSubmit: SubmitHandler<any> = async (data) => {
    setIsLoading(true);

    try {
      // Make a POST request to register user
      await axios.post("/api/register", data);

      // Sign in the user after successful registration
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // Check the response and redirect if successful
      if (signInResponse?.ok) {
        router.push("/cart");
        toast.success("Logged in");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Something went wrong during registration");
    } finally {
      setIsLoading(false);
    }
  };

  // Render the registration form
  return (
    <>
      <Heading title="Sign up for Weshop" />
      {/* Button to sign up with Google */}
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => signIn('google')}
      />
      <hr className="bg-slate-300 w-full h-px" />

      {/* Input fields for name, email, and password */}
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />

      {/* Button to submit the form */}
      <Button
        label={isLoading ? "Loading" : "Sign Up"}
        onClick={handleSubmit(onSubmit)}
      />

      {/* Link to login page if user already has an account */}
      <p className="text-sm ">
        {" "}
        Already have an account?
        <Link href="/login" className="underline">
          {" "}
          Log in{" "}
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
