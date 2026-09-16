import Link from "next/link";
import { cn } from "@/lib/utils";
import NewPasswordForm from "../../_components/new-passoword-form";
import VerifyEmailForm from "../../_components/verify-email-form";
import ResetPasswordForm from "../../_components/reset-password-form";
import { Suspense } from "react";

export default function page() {
  return (
    <div className=" flex  items-center justify-center   my-10">
      <div className="flex-1 flex-col justify-center items-center w-full max-w-md   mx-auto  p-2">
        <div className="   p-5 w-full shadow-md rounded-md">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset Your Password
              </h1>
            </div>
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className={cn(
                  "underline underline-offset-4 hover:text-primary "
                )}
              >
                Back to Sign In
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
