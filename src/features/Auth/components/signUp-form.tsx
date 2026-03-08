"use client";

import { Button } from "@/components/ui/button";
import { Mail, Github, UserRoundPen, EyeOff, Eye, MessageSquare, Chrome } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema, SignUpFormData } from "@/features/Auth/auth.schema";
import { CustomInput, SocialIcon } from "./auth-ui";

export function SignUpForm({ isActive }: { isActive?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log("Signup data:", data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-white flex flex-col items-center justify-center h-full px-10 text-center"
      noValidate
    >
      <div className="text-center mb-8 space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
          <div className="rounded-lg bg-gradient-primary p-2">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          ChatBot Pro
        </Link>

        <h1 className="text-base font-semibold text-muted-foreground">Create your account</h1>
      </div>

      <div className="w-full space-y-3">
        <CustomInput
          icon={<UserRoundPen className="w-5 h-5" />}
          placeholder="Full Name"
          register={form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-red-500 text-sm text-start">{form.formState.errors.name.message}</p>
        )}

        <CustomInput
          icon={<Mail className="w-5 h-5" />}
          placeholder="Email"
          type="email"
          register={form.register("email")}
        />

        {form.formState.errors.email && (
          <p className="text-red-500 text-sm text-start">{form.formState.errors.email.message}</p>
        )}

        <CustomInput
          icon={
            <div onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="w-5 h-5 cursor-pointer" />
              ) : (
                <Eye className="w-5 h-5 cursor-pointer" />
              )}
            </div>
          }
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          register={form.register("password")}
        />

        {form.formState.errors.password && (
          <p className="text-red-500 text-sm text-start">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="mt-4 w-full bg-gradient-primary font-bold tracking-wider cursor-pointer">
        Sign Up
      </Button>

      <div className="relative my-3 w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[1px] bg-gray-300" />
        </div>

        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <SocialIcon icon={<Github className="w-5 h-5" />} title="Continue with Github" />
        <SocialIcon icon={<Chrome className="w-5 h-5" />} title="Continue with Google" />
      </div>
    </form>
  );
}

export default SignUpForm;
