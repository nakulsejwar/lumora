import React from "react";
import Books from "./books";
import { getAllBooks } from "@/actions/library/get-all-books";

export default async function Page() {
  const { success: books, error } = await getAllBooks();

  if (error) {
    return <div className="p-10 text-center text-sm font-bold text-red-500">Unable to load library data.</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto mt-8 pb-20">
      <Books books={books} />
    </div>
  );
}
