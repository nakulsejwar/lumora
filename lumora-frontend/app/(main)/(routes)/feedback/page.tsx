"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { set, z } from "zod";
import validator from "validator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/common/navbar";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileFormSchema = z.object({
  aboutTheApp: z.string(),
  aboutTheAppValue: z.string().optional(),

  seenTheApp: z.string(),
  seenTheAppValue: z.string().optional(),
  like_review: z
    .string({
      required_error: "Please enter your feedback.",
    })
    .min(4),
  improve_review: z
    .string({
      required_error: "Please enter your feedback.",
    })
    .min(4),
  rating: z.string({
    required_error: "Please rate your experience.",
  }),
  message: z
    .string({
      required_error: "Please enter your feedback.",
    })
    .min(4),
  fullname: z
    .string()
    .min(2, {
      message: "Fullname must be at least 3 characters.",
    })
    .max(30, {
      message: "Fullname must not be longer than 30 characters.",
    })
    .optional(),
  email: z
    .string({
      required_error: "Please enter a valid email.",
    })
    .email()
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  fullname: "Jhon Doe",
  email: "jhon@email.com",
  like_review: "",
  improve_review: "",
  rating: "8",
  message: "I own a computer.",
};

function FeedbackForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // });
  const router = useRouter();

  async function onSubmit(data: ProfileFormValues) {
    const content = {
      message_name: data.fullname,
      message_email: data.email,
      like: data.like_review,
      improve: data.improve_review,
      rate: data.rating,
      message: data.message,
      aboutTheApp:
        data.aboutTheApp === "other" ? data.aboutTheAppValue : data.aboutTheApp,
      seenTheApp:
        data.seenTheApp === "yes" ? `Yes,${data.seenTheAppValue}` : `No,null`,
    };
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/lumora/contact-email/`,
        content,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      // console.log(error);
      toast.error("Failed to send feedback");
      return;
    }
    toast.success("Feedback sent successfully");
    router.push("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="aboutTheApp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you get to know about this app?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select.." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="google search">Google Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="friends">Friends and Family</SelectItem>
                  <SelectItem value="other">
                    Other{" "}
                    <span className="text-xs">
                      {"("} please specify {")"}{" "}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("aboutTheApp") === "other" && (
          <FormField
            control={form.control}
            name="aboutTheAppValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please write your answer here.</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:border-none focus:outline-none"
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="seenTheApp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Have you seen an app that does something similar?
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("seenTheApp") === "yes" && (
          <FormField
            control={form.control}
            name="seenTheAppValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please write your answer here.</FormLabel>
                <FormControl>
                  <Input
                    className=" focus:border-none focus:outline-none"
                    placeholder=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="like_review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What did you like the most about this app?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your feedback here.."
                  className="resize-none focus:outline-none focus:border-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="improve_review"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What should we improve to make this app more fun and engaging
                for you?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your feedback here.."
                  className="resize-none focus:outline-none focus:border-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Based on your experience, how likely are you to share this app
                with a friend?
              </FormLabel>
              <FormControl>
                <fieldset className="space-y-1  ">
                  <input
                    type="range"
                    className="w-full accent-orange-400 bg-white"
                    min={1}
                    max={10}
                    {...field}
                  />
                  <div aria-hidden="true" className="flex justify-between px-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                  </div>
                </fieldset>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Please provide any additional comments or suggestions.
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your feedback here.."
                  className="resize-none focus:outline-none focus:border-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name{" "}
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {"("}optional{")"}
                </span>{" "}
              </FormLabel>
              <FormControl>
                <Input
                  className=" focus:border-none focus:outline-none"
                  placeholder=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email{" "}
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {"("}optional{")"}
                </span>{" "}
              </FormLabel>
              <FormControl>
                <Input
                  className=" focus:border-none focus:outline-none"
                  placeholder=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="rounded-full w-1/3" variant="theme">
          Send
        </Button>
      </form>
    </Form>
  );
}

export default function FeedbackPage() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex flex-col md:w-full md:max-w-xl lg:max-w-2xl mx-5 md:mx-auto pt-5 pb-16">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-500  bg-clip-text text-transparent">
          Feedback
        </h1>

        <p className="text-gray-500 py-5 text-sm md:text-base text-justify">
          Send us your feedback by filling out the form below.
        </p>
        <FeedbackForm />
      </div>
    </>
  );
}
