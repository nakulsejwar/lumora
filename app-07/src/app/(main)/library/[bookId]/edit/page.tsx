import React from "react";
import { getBookData } from "@/actions/library/get-book-data";
import { EditBookForm } from "./edit-book-form";

export default async function EditPage({ params }: { params: { bookId: string } }) {
  const { success: book, error } = await getBookData(params.bookId);

  if (error || !book) {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pb-20 text-center font-bold">
        Book not found
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-8 pb-20 px-4">
      <h1 className="py-4 text-2xl font-extrabold text-[#070235]">Edit Book</h1>
      <EditBookForm book={book} />
    </div>
  );
}
