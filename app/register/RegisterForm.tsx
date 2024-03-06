"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
  currentUser : SafeUser  | null | undefined
}

const RegisterForm:React.FC<RegisterFormProps> = ({currentUser}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/cart")
      router.refresh()

    }
  }, []);
  
  // use the data comming from api/route
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
    // data will be our body
    axios
      .post('/api/register', data)
      .then(() => {
        toast.success("account created");
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })
          .then((response) => {
            if (response?.ok) {
              router.push("/cart");
              router.refresh();
              toast.success("logged in");
            }
            if (response?.error) {
              toast.error("invalid email or password");
            }
          })
      })
      .catch(() => toast.error("something went  wrong during sign-in"))
      .finally(() =>{setIsLoading(false)});
  };
  if (currentUser) {
    return <p className="text-center">Logged In, Redirecting ....</p>
  }
  return (
    <>
      <Heading title="Sign up for Weshop" />
      {/* btn sssigne up google */}
      <Button
        outline
        label="Continue with google"
        icon={AiOutlineGoogle}
        onClick={()=>{signIn('google')}}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="name"
        label="name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      {/* label dynamically the btn */}
      <Button
        label={isLoading ? "Loading" : "Sign Up"}
        onClick={handleSubmit(onSubmit)}
      />
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
