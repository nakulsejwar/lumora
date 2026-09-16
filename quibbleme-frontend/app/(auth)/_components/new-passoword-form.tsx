"use client";

import { FC, useCallback, useState } from "react";
import { Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import Link from "next/link";
import { z } from "zod";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmResetPassword, signUp } from "@/lib/utils/auth-service";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const validationSchema = z
  .object({
    code: z.string().min(8, { message: "Verification code is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof validationSchema>;

const NewPasswordForm: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const username: string = searchParams.get("username") as string;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const toggleConfirmPassword = () => {
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
      return;
    }
    setConfirmPasswordType("password");
  };

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
      await confirmResetPassword({
        username,
        confirmationCode: data.code,
        newPassword: data.password,
      });
      router.push("/login");
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
    <div className="">
      <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className=" flex flex-col gap-4">
          <div className="">
            <p className="text-left text-sm">
              Confirmation Code <span className="text-red-500">*</span>
            </p>
            <input
              className="flex pl-5 p-2 flex-grow focus:outline-none border rounded-md bg-transparent bg-none"
              {...register("code")}
            />
          </div>
          <div className="">
            <div className="flex items-center gap-2 text-left text-sm">
              <p>
                {" "}
                Password <span className="text-red-500">*</span>
              </p>
              <Tooltip
                enterTouchDelay={0}
                TransitionComponent={Zoom}
                placement="top-start"
                leaveTouchDelay={5000}
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#d9d6d6",
                      fontFamily: "lexand",
                      "& .MuiTooltip-arrow": {
                        color: "#fca95e",
                      },
                    },
                  },
                }}
                title={
                  <span className="text-black md:text-sm">
                    Should contain at least
                    <li>one lowercase letter</li>
                    <li> one uppercase letter</li>
                    <li> one digit </li>
                    <li>and one special character {` (@$!%*?&)`}</li>
                    <li>Minimum length - 8</li>
                  </span>
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path
                    d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM13 13.3551C14.4457 12.9248 15.5 11.5855 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.302 6.5 8.88637 7.70919 8.56731 9.31346L10.5288 9.70577C10.6656 9.01823 11.2723 8.5 12 8.5C12.8284 8.5 13.5 9.17157 13.5 10C13.5 10.8284 12.8284 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5V14H13V13.3551Z"
                    fill="#fca95e"
                  ></path>
                </svg>
              </Tooltip>
            </div>
            <div className="flex items-center justify-between border  pr-2 bg-white w-full rounded-md shadow-sm text-sm">
              <input
                className="flex pl-5 p-2 flex-grow focus:outline-none border-none outline-none rounded-l-xl bg-transparent bg-none"
                {...register("password")}
                type={passwordType}
              />

              <div
                className="flex  items-center justify-end"
                onClick={togglePassword}
              >
                {passwordType === "password" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 "
                  >
                    <path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4"
                  >
                    <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-2 text-left text-sm">
              <p>
                {" "}
                Confirm Password <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="flex items-center justify-between border  pr-2 bg-white w-full rounded-md shadow-sm text-sm">
              <input
                className="flex pl-5 p-2 flex-grow focus:outline-none border-none outline-none rounded-l-xl bg-transparent bg-none"
                {...register("confirmPassword")}
                type={confirmPasswordType}
              />

              <div
                className="flex  items-center justify-end"
                onClick={toggleConfirmPassword}
              >
                {confirmPasswordType === "password" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 "
                  >
                    <path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4"
                  >
                    <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <Button disabled={loading} variant="theme">
            {loading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4 animate-spin"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
            Confirm
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewPasswordForm;
