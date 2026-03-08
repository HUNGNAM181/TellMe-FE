import { Input } from "@/components/ui/input";
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  register: UseFormRegisterReturn;
}

export function SocialIcon({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <a
      href="#"
      className="flex flex-row items-center justify-center gap-2 border border-gray-300 rounded-lg p-2 hover:bg-gray-100 transition-colors text-gray-700"
    >
      {icon} <span className="text-sm font-semibold">{title}</span>
    </a>
  );
}

export function CustomInput({ icon, placeholder, type = "text", register }: CustomInputProps) {
  return (
    <div className="relative w-full">
      <Input
        type={type}
        placeholder={placeholder}
        {...register}
        className="bg-[#eee] border-none pl-4 pr-10 py-5 rounded-lg focus-visible:ring-1 focus-visible:ring-[#512da8]"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
    </div>
  );
}
