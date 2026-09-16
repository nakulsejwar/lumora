"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";
import { cn } from "@/lib/utils";
import { BookOpen, Sparkles, Filter, Clock, ChevronRight } from "lucide-react";
import DateComponent from "@/components/date-component";

const GENRES = ["All", "Mystery", "Adventure", "Science", "History", "Nature", "Fantasy", "Real World"];

export default function Library() {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ["booksData"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/lumora/library/books/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const moddata = data.filter(
          (item: any) => item.userEmail !== "ge.dev009@gmail.com"
        );

        return process.env.NEXT_PUBLIC_ENVIRONMENT === "main"
          ? moddata.filter((item: any) => item.isLive).reverse()
          : moddata.reverse();
      } catch (error) {
        console.error("Failed to fetch books", error);
        return null;
      }
    },
  });

  const filteredBooks = books?.filter((book: any) => {
    if (selectedGenre === "All") return true;
    return book.category?.toLowerCase() === selectedGenre.toLowerCase();
  }) || [];

  if (isBooksLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center gap-2 mt-20">
        <div className="w-4 h-4 rounded-full animate-pulse bg-[#fe932c]" />
        <div className="w-4 h-4 rounded-full animate-pulse bg-[#070235]" />
        <div className="w-4 h-4 rounded-full animate-pulse bg-[#fe932c]" />
      </div>
    );
  }

  const featuredBook = filteredBooks[0];
  const remainingBooks = filteredBooks.slice(1);

  return (
    <div className="flex min-h-screen w-full flex-col my-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="mb-10 text-center sm:text-left border-b border-[#c8c5d0]/40 pb-8">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#070235] flex items-center justify-center text-[#fe932c] shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-extrabold text-[#904d00] tracking-widest uppercase bg-[#fe932c]/15 px-2.5 py-1 rounded border border-[#fe932c]/30">
            Reading Collection
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#070235] tracking-tight">
          Lumora Library
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#47464f] max-w-2xl">
          Explore curated digital books, interactive stories, and reading passages designed to build vocabulary, critical thinking, and comprehension mastery.
        </p>

        {/* GENRE FILTER BADGES */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#47464f] mr-2">
            <Filter className="w-3.5 h-3.5 text-[#fe932c]" />
            <span>Genre:</span>
          </div>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                selectedGenre === genre
                  ? "bg-[#070235] text-white border-[#070235] shadow-xs"
                  : "bg-white text-[#47464f] border-[#c8c5d0] hover:border-[#070235] hover:text-[#070235]"
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED BOOK */}
      {featuredBook && (
        <div className="mb-12">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#904d00] mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fe932c]" />
            Featured Book
          </h2>
          <Link
            onClick={() => {
              sendGTMEvent({
                event: "book_click",
                bookId: `${featuredBook.book_id || featuredBook.blog_id}`,
                bookTitle: `${featuredBook.title}`,
              });
            }}
            href={`/library/${featuredBook.book_id || featuredBook.blog_id}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl p-4 sm:p-6 border border-[#c8c5d0]/70 shadow-sm hover:shadow-md transition-all"
          >
            <div className="md:col-span-6 relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={featuredBook.ImgUrl || "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg"}
                alt={featuredBook.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="md:col-span-6 flex flex-col justify-between py-2">
              <div>
                <span className="inline-block text-xs font-mono font-bold text-[#070235] bg-[#eaedff] px-2.5 py-1 rounded-md mb-3 border border-[#c8c5d0]/50">
                  {featuredBook.category || "General Reading"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#070235] group-hover:text-[#fe932c] transition-colors leading-tight">
                  {featuredBook.title}
                </h3>
                <p className="mt-3 text-sm text-[#47464f] line-clamp-3 leading-relaxed">
                  {featuredBook.content?.replace(/<[^>]*>?/gm, "") || "Step into this story to practice reading rhythm, uncover hidden clues, and complete interactive questions."}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#c8c5d0]/40">
                <div className="flex items-center gap-1.5 text-xs text-[#47464f]">
                  <Clock className="w-3.5 h-3.5" />
                  <DateComponent datetime={featuredBook.created_at} type="relative" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#070235] group-hover:translate-x-1 transition-transform">
                  Read Book <ChevronRight className="w-4 h-4 text-[#fe932c]" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ALL / REMAINING BOOKS GRID */}
      <div>
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#47464f] mb-6">
          {selectedGenre === "All" ? "Explore All Books" : `${selectedGenre} Books`} ({filteredBooks.length})
        </h2>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingBooks.map((book: any) => (
              <Link
                key={book.book_id || book.blog_id}
                onClick={() => {
                  sendGTMEvent({
                    event: "book_click",
                    bookId: `${book.book_id || book.blog_id}`,
                    bookTitle: `${book.title}`,
                  });
                }}
                href={`/library/${book.book_id || book.blog_id}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#c8c5d0]/70 shadow-xs hover:shadow-md transition-all"
              >
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src={book.ImgUrl || "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg"}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#070235]/80 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    {book.category || "Story"}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#070235] group-hover:text-[#fe932c] transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#47464f] pt-3 border-t border-[#c8c5d0]/30">
                    <DateComponent datetime={book.created_at} type="relative" />
                    <span className="font-bold text-[#070235] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Read <ChevronRight className="w-3.5 h-3.5 text-[#fe932c]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#c8c5d0]">
            <BookOpen className="w-10 h-10 text-[#c8c5d0] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#070235]">No books found in this genre</h3>
            <p className="text-xs text-[#47464f] mt-1">Select another genre above to explore available books.</p>
          </div>
        )}
      </div>
    </div>
  );
}
