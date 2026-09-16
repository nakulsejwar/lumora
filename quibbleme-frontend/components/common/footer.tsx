import Link from "next/link";

export default function Footer() {
  return (
    <div className=" w-full max-w-7xl mx-auto p-5 text-center flex flex-col md:flex-row items-center justify-between">
      <p className="text-xs md:p-2 text-[#3362BA]">
        2025 @ All Rights Reserved by General Enterprises
      </p>
      <Link href="/privacy-policy" className="text-xs md:p-2 text-[#3362BA]">
        Privacy Policy
      </Link>
    </div>
  );
}
