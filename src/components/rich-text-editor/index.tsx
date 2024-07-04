import Document from "@tiptap/extension-document";
import { RichTextEditor, Link } from "@mantine/tiptap";

import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import React, { type Dispatch, type SetStateAction, useState } from "react";

import Fuse from "fuse.js";

import { renderSuggestion } from "./suggestion";
import { api } from "@/utils/api";
import { toast } from "sonner";

const options = {
  includeScore: true,

  keys: ["name"],
  findAllMatches: true,
};

export default function RichTextEditorComponent({
  data,
  fetchSingleTask,
  initials,
  id,
}: {
  data: { name: string | null; email: string | null; id: string }[];
  setContent?: Dispatch<SetStateAction<string>>;
  value?: string;
  initials: string | undefined;
  id: string;
  fetchSingleTask: (id: string) => void;
}) {
  const [comment, setComment] = useState("");
  const { mutate: addComment } = api.task.addComment.useMutation({
    onSuccess() {
      fetchSingleTask(id);
      toast.success("Comment added successfully");

      setComment("");
    },
  });

  const addCommentMutation = () => {
    addComment({
      taskId: id,
      comment: comment,
    });
  };

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: "text-link",
        },
        suggestion: {
          render: renderSuggestion,
          items: ({ query }) => {
            if (query === "") {
              return data.map((n) => n.name);
            }
            return new Fuse(data, options)
              .search(query.toLocaleLowerCase())
              .map((n) => n.item.name);
          },
        },

        renderLabel: ({ options, node }) => {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`;
        },
      }),
      Placeholder.configure({
        placeholder: "Add comment",
      }),
    ],
    content: comment,

    editorProps: {
      attributes: {
        class: "prose prose-sm prose min-h-[100px] max-w-full pl-2",
      },
    },
    onTransaction: (props) => {
      setComment(props.editor?.getHTML());
    },
  });

  return (
    <>
      <div className="flex   w-full items-center justify-between">
        <div className="flex w-full items-start gap-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 ">
            {initials}
          </div>
          <div className="group mr-1 h-full w-full border ">
            {/* <EditorContent
              editor={editor}
              className="group-focus-within:!border-none group-focus-within:!outline-none group-focus-visible:!border-none  group-focus-visible:!outline-none"
            /> */}
            <RichTextEditor editor={editor}>
              <RichTextEditor.Content
                content={comment}
                contextMenu=""
                className="relative"
              >
                <button
                  onClick={addCommentMutation}
                  className="absolute bottom-[4px] right-2 z-10 hidden rounded px-3 py-1 group-focus-within:block group-focus-within:bg-[#4573d2]"
                >
                  comment
                </button>
              </RichTextEditor.Content>
            </RichTextEditor>
          </div>
        </div>
      </div>
    </>
  );
}
