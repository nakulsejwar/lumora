"use client";

import React from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Menubar from "./menu-bar";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// load all highlight.js languages
import "./styles/tiptap.scss";
import CodeBlockEditor from "./code-block-editor";
import { TipTapEditorCssClasses } from "@/lib/utils";
import { createLowlight } from "lowlight";
const lowlight = createLowlight();
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
const TiptapEditor = ({ onChange, content }: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        history: false,
        codeBlock: false,
      }),
      TaskList,
      TaskItem,

      Link.extend({
        inclusive: false,
      }).configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
        linkOnPaste: true,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          // Change rel to different value
          // Allow search engines to follow links(remove nofollow)
          rel: "noopener noreferrer",
          // Remove target entirely so links open in current tab
          target: "_blank",
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockEditor);
        },
      }).configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },

    content: content,
  });

  return (
    <div className={"editor " + TipTapEditorCssClasses}>
      {editor && <Menubar editor={editor} />}
      <EditorContent
        style={{ whiteSpace: "pre-line", minHeight: "150px" }}
        className="editor__content"
        editor={editor}
      />
    </div>
  );
};

export default TiptapEditor;
