"use client";

import SignInForm from "./signIn-form";
import SignUpForm from "./signUp-form";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isRegister = searchParams.get("mode") === "signup";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
      <div className="relative w-[850px] h-[600px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-1000 ease-in-out z-10
          ${isRegister ? "translate-x-full opacity-100 visible" : "left-0 opacity-0 invisible"}
        `}
        >
          <SignUpForm isActive={isRegister} />
        </div>

        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-1000 ease-in-out z-20
          ${isRegister ? "translate-x-full opacity-0 invisible" : "left-0"}
        `}
        >
          <SignInForm isActive={!isRegister} />
        </div>

        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-1000 ease-in-out z-50 rounded-l-[150px]
          ${isRegister ? "-translate-x-full rounded-l-none rounded-r-[150px]" : ""}
        `}
        >
          <div
            className={`bg-gradient-to-r from-purple-600 to-violet-500 text-white relative -left-full h-full w-[200%] transform transition-transform duration-1000 ease-in-out
            ${isRegister ? "translate-x-1/2" : "translate-x-0"}
          `}
          >
            <div
              className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-8 text-center transition-transform duration-1000 ease-in-out
              ${isRegister ? "translate-x-0" : "-translate-x-[200%]"}
            `}
            >
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="mb-6">Already have an account?</p>

              <button
                onClick={() => router.push("/auth?mode=signin")}
                className="cursor-pointer bg-transparent border border-white text-white py-2 px-10 rounded-lg font-semibold tracking-wider hover:bg-white/20 transition-colors"
              >
                Sign In
              </button>
            </div>

            <div
              className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-8 text-center transition-transform duration-1000 ease-in-out
              ${isRegister ? "translate-x-[200%]" : "translate-x-0"}
            `}
            >
              <h1 className="text-4xl font-bold mb-4">Hello, Welcome!</h1>
              <p className="mb-6">Don't have an account?</p>

              <button
                onClick={() => router.push("/auth?mode=signup")}
                className="cursor-pointer bg-transparent border border-white text-white py-2 px-10 rounded-lg font-semibold tracking-wider hover:bg-white/20 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
