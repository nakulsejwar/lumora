"use client";

import { FC, useCallback, useState } from "react";

import Link from "next/link";
import { z } from "zod";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/utils/auth-service";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const validationSchema = z.object({
  email: z.string().min(3, { message: "Email is required" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const ResetPasswordForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const output = await resetPassword({
        username: data.email,
      });

      router.push(
        `/newpassword?${createQueryString(`username`, `${data.email}`)}`
      );
    } catch (error) {
      // console.log({
      //   error:
      //     error instanceof Error
      //       ? error.message
      //       : "Failed to do something exceptional",
      // });
      toast({
        title: (error as Error).message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="  ">
      <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col  gap-4">
          <div className="grid gap-1 text-sm">
            <p>
              {" "}
              Email <span className="text-red-500">*</span>
            </p>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
              className="flex pl-5 p-2 flex-grow focus:outline-none border rounded-md bg-transparent bg-none"
              {...register("email")}
            />
          </div>

          <Button variant="theme" type="submit">
            {loading ? "loading.." : "Send Code"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
