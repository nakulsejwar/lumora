"use client";
import DateComponent from "@/components/date-component";
import Content from "@/components/tiptap/content";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BookOpen, Edit3, ChevronLeft } from "lucide-react";

export default function BookPage({ book }: { book: any }) {
  if (!book) {
    return (
      <div className="py-20 text-center">
        <BookOpen className="w-12 h-12 text-[#c8c5d0] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#070235]">Book Not Found</h2>
        <p className="text-sm text-[#47464f] mt-1">This book could not be loaded.</p>
        <Link href="/library" className="mt-4 inline-block text-xs font-bold text-[#fe932c] hover:underline">
          Return to Library Management
        </Link>
      </div>
    );
  }

  const id = book.book_id || book.blog_id;

  return (
    <div className="py-6 px-4 flex flex-col items-center max-w-4xl mx-auto">
      <div className="flex items-center justify-between w-full mb-6 border-b border-[#c8c5d0]/40 pb-4">
        <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#47464f] hover:text-[#070235]">
          <ChevronLeft className="w-4 h-4 text-[#fe932c]" />
          <span>Back to Library</span>
        </Link>
        <Link href={`/library/${id}/edit`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold border-[#070235] text-[#070235]">
            <Edit3 className="w-3.5 h-3.5 text-[#fe932c]" />
            Edit Book
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold text-[#070235] w-full tracking-tight mb-3">{book.title}</h1>
      
      <div className="flex items-center justify-between w-full text-xs text-[#47464f] pb-4 mb-6 border-b border-[#c8c5d0]/30">
        <DateComponent datetime={book.created_at} type="date" />
        <p>{book.userEmail || book.user_email}</p>
      </div>

      {book.ImgUrl && (
        <div className="w-full relative h-80 rounded-2xl overflow-hidden mb-8 border border-[#c8c5d0]/50 bg-slate-100">
          <Image
            src={book.ImgUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="w-full prose max-w-none">
        <Content content={book.content} />
      </div>
    </div>
  );
}
