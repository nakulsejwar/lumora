"use client";

import React from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import { TiptapExtensions } from "./extensions";
import "@/styles/tiptap.scss";
import { createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import CodeBlockView from "./code-block-view";
const lowlight = createLowlight();
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
const Content = ({ content }: { content: any }) => {
  const [editable, setEditable] = React.useState(false);
  const editor = useEditor({
    editable,
    immediatelyRender: false,
    extensions: [
      ...TiptapExtensions,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }).configure({
        lowlight,
      }),
    ],
    content: content,
  });

  return (
    <div className={`prose`}>
      <EditorContent className="editor__content" editor={editor} />
    </div>
  );
};

export default Content;
