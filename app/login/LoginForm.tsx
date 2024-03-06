"use client"
import { useEffect, useState } from "react"
import Heading from "../components/Heading"
import Input from "../components/inputs/Input"
import { FieldValues, useForm ,SubmitHandler} from "react-hook-form"
import Button from "../components/Button"
import Link from "next/link"
import { AiOutlineGoogle } from "react-icons/ai"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types"

interface LoginFormProps {
  currentUser : SafeUser  | null | undefined
}

const LoginForm :React.FC<LoginFormProps> = ({currentUser}) => {
        const [isLoading,setIsLoading]=useState(false)
        const {register,handleSubmit,formState:{errors},} = useForm<FieldValues>({
          defaultValues: {
            email:"",
            password:"",  
          },  
        })
  const router = useRouter();
  
  useEffect(() => {
    if (currentUser) {
      router.push("/cart")
      router.refresh()

    }
  }, [currentUser, router]);
  
        const onSubmit:SubmitHandler<FieldValues> =(data)=>{
    
            setIsLoading(true)
          console.log(data)
          signIn('credentials', {
            ...data,
            redirect:false,
          }).then((response) => {
            setIsLoading(false)
            if (response?.ok) {
              router.push("/cart");
              router.refresh();
              toast.success("logged in");
            }
            if (response?.error) {
              toast.error("invalid email or password");
            }
          })
        }
  if (currentUser) {
    return <p className="text-center">Logged In, Redirecting ....</p>
  }
      return (
        <>
        <Heading title="Sign In for Weshop"/>
        {/* btn sssigne up google */}
        <Button 
            outline
            label="continue with google"
            icon = {AiOutlineGoogle}
            onClick={()=>{signIn('google')}}
        />
        <hr className="bg-slate-300 w-full h-px"/>
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
        <Button  label={isLoading? "Loading":"Login"} 
                 onClick={handleSubmit(onSubmit)}/>
        <p className="text-sm "> Do not have an account?  
            <Link href= '/register' className="underline"> Sign Up </Link>
        </p>         
        </>
      )
    }
    
export default LoginForm