"use client";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLoadingModal } from "@/hooks/use-loading-modal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { deleteBook } from "@/actions/library/delete-book";
import DateComponent from "@/components/date-component";
import Image from "next/image";

export default function Books({ books }: { books: any }) {
  const loadingModal = useLoadingModal();

  const onDelete = async (id: string) => {
    loadingModal.onOpen();
    const { success, error } = await deleteBook(id);
    if (error) {
      loadingModal.onClose();
      return toast.error("Something went wrong deleting the book");
    }

    toast.success("Book deleted successfully! 🎉");
    loadingModal.onClose();
  };

  return (
    <div className="px-6 md:px-10">
      <div className="flex items-center justify-between py-6 border-b border-[#c8c5d0]/40 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#070235]">Library Management</h1>
          <p className="text-xs text-[#47464f] mt-1">Manage and edit digital books, story passages, and comprehension quizzes.</p>
        </div>
        <Link
          href="/create-book"
          className="px-4 py-2 rounded-xl bg-[#070235] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#fe932c] hover:text-[#070235] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Book</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        {books && books.length > 0 ? (
          books.map((book: any) => {
            const id = book.book_id || book.blog_id;
            return (
              <div
                key={id}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#c8c5d0]/70 shadow-xs hover:shadow-md transition-all p-3"
              >
                <Link href={`/library/${id}`}>
                  <div className="w-full h-44 relative bg-slate-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={book.ImgUrl || "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-base font-bold text-[#070235] group-hover:text-[#fe932c] transition-colors line-clamp-2 mb-2">
                    {book.title}
                  </h3>
                </Link>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#c8c5d0]/30 text-xs text-[#47464f]">
                  <DateComponent datetime={book.created_at} type="relative" />
                  <button
                    onClick={() => onDelete(id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete Book"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[#c8c5d0]">
            <BookOpen className="w-10 h-10 text-[#c8c5d0] mb-3" />
            <h3 className="text-lg font-bold text-[#070235]">No books in your library</h3>
            <p className="text-xs text-[#47464f] mt-1 mb-4">Create your first reading book or story passage.</p>
            <Link
              href="/create-book"
              className={cn(buttonVariants({ variant: "outline" }), "text-xs font-bold")}
            >
              Create Book
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
