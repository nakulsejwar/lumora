"use client";
import Navbar from "@/components/common/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" ">
      <Navbar />

      {children}
    </div>
  );
};

export default AuthLayout;
