"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      redirect: false,
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto mt-12">
      <form onSubmit={onSubmit} className="flex flex-col w-full gap-4">
        <h2 className="text-xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
        <Button size="lg" className="w-full" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};
