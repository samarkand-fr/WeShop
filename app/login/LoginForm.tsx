"use client"
// Import necessary libraries and components.
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

// Define the properties expected by the LoginForm component.
interface LoginFormProps {
  currentUser: SafeUser | null | undefined;
}

// LoginForm component for user authentication.
const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form configuration.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  // Redirect user if already logged in.
  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);

  // Handle form submission.
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Sign in using NextAuth credentials provider.
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((response) => {
      setIsLoading(false);

      // Handle response from the authentication process.
      if (response?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success("Logged in successfully");
      }
      if (response?.error) {
        toast.error("Invalid email or password");
      }
    });
  };

  // Display loading message while redirecting.
  if (currentUser) {
    return <p className="text-center">Logged In, Redirecting ....</p>;
  }

  // Render the login form.
  return (
    <>
      <Heading title="Sign In for Weshop" />
      {/* Button to sign in with Google */}
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => {
          signIn("google");
        }}
      />
      <hr className="bg-slate-300 w-full h-px" />
      {/* Input fields for email and password */}
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
      {/* Button to submit the login form */}
      <Button label={isLoading ? "Loading" : "Login"} onClick={handleSubmit(onSubmit)} />
      {/* Link to navigate to the registration page */}
      <p className="text-sm">
        Do not have an account?
        <Link href="/register" className="underline">
          {" "}
          Sign Up{" "}
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
