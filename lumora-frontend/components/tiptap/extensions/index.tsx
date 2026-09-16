// import FileHandler from "@tiptap-pro/extension-file-handler";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import TiptapUnderline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Placeholder as ImagePlaceholder } from "../plugins/placeholder";
// import { uploadImg } from "./upload-image";
import CharacterCount from "@tiptap/extension-character-count";

const CustomImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [ImagePlaceholder];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: " p-1",
  },
});
export const TiptapExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class:
          "list-disc list-outside leading-3 my-2 [&_li]:leading-6 [&_li]:mt-2  ",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class:
          "list-decimal list-outside leading-3 my-2 [&_li]:leading-6 [&_li]:mt-2  ",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: " border-l-4 border-gray-2 italic font-medium",
      },
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class:
          "rounded-lg border border-gray-2 bg-gray-200 dark:bg-zinc-700    px-1 py-0.5 font-normal",
        spellcheck: "false",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "border-gray-2",
      },
    },
  }),
  CustomImage,
  TiptapUnderline,
  TextStyle,
  Color,
  Typography,
  Link.extend({ inclusive: false }).configure({
    HTMLAttributes: {
      class:
        "text-secondary underline underline-offset-2 cursor-pointer font-normal",
      // Change rel to different value
      // Allow search engines to follow links(remove nofollow)
      rel: "noopener noreferrer",
      // Remove target entirely so links open in current tab
      target: "_blank",
    },
    autolink: true,
  }),
  //   FileHandler.configure({
  //     allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  //     onDrop: (editor, files) => uploadImg(files[0], editor.view),
  //   }),
  Markdown.configure({
    transformCopiedText: true,
    transformPastedText: true,
  }),
  Placeholder.configure({
    includeChildren: true,
    placeholder: ({ node }: { node: any }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }

      return "Write or type '/ ' for commands";
    },
  }),
  Highlight,
  TaskList.configure({
    HTMLAttributes: {
      class: "pl-0 ",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start [&_p]:my-0",
    },
    nested: true,
  }),
  CharacterCount.configure({
    limit: 10000,
  }),
];
