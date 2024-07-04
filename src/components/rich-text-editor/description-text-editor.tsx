import Document from "@tiptap/extension-document";
import { RichTextEditor } from "@mantine/tiptap";

import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {  type JSONContent, useEditor } from "@tiptap/react";
import React, {  useState } from "react";

import Fuse from "fuse.js";

import { renderSuggestion } from "./suggestion";
import { api } from "@/utils/api";
import { toast } from "sonner";

const options = {
  includeScore: true,

  keys: ["name"],
  findAllMatches: true,
};



export default function DescriptionRichTextEditorComponent({
  data,
  fetchSingleTask,
  id,
  content,
}: {
  data: { name: string | null; email: string | null; id: string }[];
  content?: string | null | undefined;
  value?: string;
  initials: string | undefined;
  id: string;
  fetchSingleTask: (id: string) => void;
}) {
  const [description, setComment] = useState("");
  const { mutate: addDescription } = api.task.addDescription.useMutation({
    onSuccess() {
      fetchSingleTask(id);
      toast.success("Comment added successfully");

      setComment("");
    },
  });
  console.log(content);
  const addDescriptionMutation = () => {
    addDescription({
      taskId: id,
      description: description,
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
        placeholder: "Add a note",
      }),
    ],
    content,

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
      <div className="group mr-1 h-full w-full  ">
        {" "}
        <RichTextEditor editor={editor}>
          <RichTextEditor.Content className="relative ">
            <button
              onClick={addDescriptionMutation}
              className="absolute bottom-[4px] right-2 z-10 hidden rounded px-3 py-1 group-focus-within:block group-focus-within:bg-[#4573d2]"
            >
              add
            </button>
          </RichTextEditor.Content>
        </RichTextEditor>
      </div>
    </>
  );
}
