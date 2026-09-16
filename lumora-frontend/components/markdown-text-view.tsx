"use client";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";

export default function MarkdownTextView({ text }: { text: string }) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    // This code will be executed only on the client side after the component is mounted
    if (text.length === 0) return;

    const domPurify = DOMPurify(window);
    const cleanHtml = domPurify.sanitize(text); // You might want to pass your markdown-converted HTML here
    setSanitizedHtml(cleanHtml);
  }, [text]); // This effect will re-run if the 'text' prop changes

  if (!sanitizedHtml) return null; // or some placeholder/loading indicator

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>;
}
