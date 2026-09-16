"use client";

import * as React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import Zoom from "@mui/material/Zoom";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/utils/auth-service";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import GoogleButton from "@/components/common/google-button";
import FacebookButton from "@/components/common/facebook-button";
import SocialLoginButtons from "@/components/common/social-login-buttons";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const validationSchema = z.object({
  email: z.string().min(3, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [passwordType, setPasswordType] = React.useState("password");
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await signIn({ username: data.email, password: data.password });
      router.push("/courses");
      router.refresh();
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        // title: "Uh oh! Something went wrong.",
        title: (error as Error).message,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("grid gap-5", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1.5 text-xs font-extrabold text-[#070235] uppercase tracking-wider">
            <label htmlFor="email">
              Email Address <span className="text-amber-600">*</span>
            </label>
            <input
              id="email"
              placeholder="detective@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-[#faf8ff] focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs font-bold text-red-600 normal-case">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="grid gap-1.5 text-xs font-extrabold text-[#070235] uppercase tracking-wider">
            <div className="flex items-center justify-between">
              <label htmlFor="password">
                Password <span className="text-amber-600">*</span>
              </label>
            </div>

            <div className="flex items-center justify-between border border-slate-200 bg-[#faf8ff] w-full rounded-xl focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent text-sm">
              <input
                className="w-full px-4 py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
                {...register("password")}
                type={passwordType}
                placeholder="••••••••"
              />

              <button
                type="button"
                className="px-3 text-xs font-bold text-slate-400 hover:text-indigo-900 transition-colors"
                onClick={togglePassword}
              >
                {passwordType === "password" ? "Show" : "Hide"}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-bold text-red-600 normal-case">
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            disabled={isLoading}
            variant="theme"
            className="w-full py-3.5 mt-2 text-sm font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-indigo-900 hover:from-[#1e1b4b] hover:to-indigo-950 rounded-xl shadow-lg shadow-indigo-950/20 transition-all"
          >
            {isLoading ? "Authenticating…" : "Sign In to Mission →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
