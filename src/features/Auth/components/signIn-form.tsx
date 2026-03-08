"use client";

import { Button } from "@/components/ui/button";
import { Chrome, Eye, EyeOff, Github, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { authService } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";
import { CustomInput, SocialIcon } from "./auth-ui";

import { SignInFormData, signInSchema } from "../auth.schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleApiError } from "@/lib/api-error";

interface SignInFormProps {
  isActive?: boolean;
}

export function SignInForm({ isActive = true }: SignInFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isActive) {
      form.reset();
    }
  }, [isActive, form]);

  async function onSubmit(values: SignInFormData) {
    setIsLoading(true);

    try {
      await authService.login({
        username: values.username,
        password: values.password,
      });

      toast({
        title: "Success",
        description: "Signed in successfully!",
      });

      router.replace("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: handleApiError(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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

        <h1 className="text-base font-semibold text-muted-foreground">Sign in to your account</h1>
      </div>

      <div className="w-full space-y-3">
        <CustomInput icon={<User className="w-5 h-5" />} placeholder="Username" register={form.register("username")} />

        {form.formState.errors.username && (
          <p className="text-red-500 text-sm text-start">{form.formState.errors.username.message}</p>
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

        <Link href="/forgot-password" className="block w-full text-right text-sm text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button disabled={isLoading} className="mt-4 w-full bg-gradient-primary font-bold tracking-wider cursor-pointer">
        {isLoading ? "Processing..." : "Sign In"}
      </Button>

      <div className="relative my-3 w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[1px] bg-gray-300" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
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

export default SignInForm;
