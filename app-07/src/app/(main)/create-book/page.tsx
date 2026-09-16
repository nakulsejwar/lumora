import React from "react";
import { CreateBookForm } from "@/components/forms/create-book-form";

export default function CreateBookPage() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-8 pb-20 px-4">
      <h1 className="py-4 text-2xl font-extrabold text-[#070235]">Create New Book</h1>
      <p className="text-xs text-[#47464f] -mt-3 mb-4">Draft educational story passages, digital books, and comprehension quizzes.</p>
      <CreateBookForm />
    </div>
  );
}
