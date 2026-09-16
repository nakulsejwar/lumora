"use client";
import React, { FC, useEffect, useState, MouseEvent } from "react";

import Link from "next/link";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";
import { confirmSignUp, resendSignUpCode } from "@/lib/utils/auth-service";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type FormValues = {
  otp: string;
};

const VerifyEmailForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const username: string = searchParams.get("username") as string;
  const email: string = searchParams.get("email") as string;

  const [loading, setLoading] = useState(false);
  const [codeResendSuccess, setCodeResendSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp({ username, confirmationCode: data.otp });
      router.push("/login");
    } catch (error) {
      // console.log({
      //   error:
      //     error instanceof Error
      //       ? error.message
      //       : "Failed to do something exceptional",
      // });
      toast({ title: (error as Error).message });
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username });
      setCodeResendSuccess(true);
    } catch (error) {
      // console.log({
      //   error:
      //     error instanceof Error
      //       ? error.message
      //       : "Failed to do something exceptional",
      // });
    }
  };

  useEffect(() => {
    if (codeResendSuccess) {
      setTimeout(() => setCodeResendSuccess(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeResendSuccess]);

  return (
    <div className="  w-full">
      <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col gap-5">
          <div className="">
            <p className="text-left">Email *</p>
            <input
              className="border border-blue-200  px-5 p-2 w-full rounded-xl shadow-sm text-sm focus:outline-none"
              type="text"
              value={username}
              disabled
            />
          </div>
          <div className=" ">
            <p className="text-left ">Verification Code *</p>
            <input
              {...register("otp")}
              className="border border-blue-200  px-5 p-2 w-full rounded-xl shadow-sm text-sm focus:outline-none"
            />
            <p className="text-xs pt-2">Verification code sent to {email} </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="theme"
              type="submit"
              className="rounded-full px-4 py-1 mt-2  transform active:scale-95  text-xl shadow-sm text-center"
            >
              {loading ? "loading.." : "Confirm"}
            </Button>
            <Button
              type="button"
              onClick={handleResendCode}
              variant="theme"
              className="rounded-full px-4 py-1 mt-2  transform active:scale-95  text-xl shadow-sm text-center"
            >
              {codeResendSuccess ? "Code Sent" : "Resend code"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
