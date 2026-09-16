"use client";

import React from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "tiptap-markdown";
import Image from "@tiptap/extension-image";
import { EditorContent, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// load all highlight.js languages
import "@/components/tiptap/styles/tiptap.scss";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import CodeBlockView from "@/components/tiptap/code-block-view";
import { TipTapEditorCssClasses } from "@/lib/utils";
import Link from "@tiptap/extension-link";
import { createLowlight } from "lowlight";
dayjs.extend(utc);
dayjs.extend(tz);
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
      StarterKit.configure({
        history: false,
        codeBlock: false,
      }),
      TaskList,
      TaskItem,
      Typography,
      Markdown,
      Image,

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
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }).configure({ lowlight }),
      CharacterCount.configure({
        limit: 10000,
      }),
    ],
    content: content,
  });

  return (
    <div className={"mt-4 pb-2 " + TipTapEditorCssClasses}>
      <EditorContent className="editor__content" editor={editor} />
    </div>
  );
};

export default Content;
