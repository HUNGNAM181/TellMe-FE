import { Suspense } from "react";
import AuthPage from "@/features/Auth/components/Auth";

export default function Page() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
