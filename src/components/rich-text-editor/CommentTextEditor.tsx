import Document from "@tiptap/extension-document";

import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { RichTextEditor } from "@mantine/tiptap";

import Fuse from "fuse.js";

import { renderSuggestion } from "./suggestion";
import { api } from "@/utils/api";
import { LuCornerDownLeft } from "react-icons/lu";
import { toast } from "sonner";
// import { type Task } from "../drag-drop/types";
import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button";
import { Tasks } from "@/types";
// import { Task } from "../kanban-board/types";

const options = {
  includeScore: true,
  keys: ["name"],
  findAllMatches: true,
};

export default function CommentTextEditor({
  data,
  setTasks,
  id,
  type,
  fetchSingleTask,
  setSingleRequestData,
  refetchAllRequest,
}: {
  data: {
    name: string | null;
    email: string | null;
    id: string;
    profileImage?: string;
  }[];
  setContent?: Dispatch<SetStateAction<string>>;
  value?: string;
  id: string;
  type: "TASK" | "SUBTASK";
  fetchSingleTask: any;
  setSingleRequestData?: any;
  refetchAllRequest?: any;
  setTasks?: Dispatch<SetStateAction<Tasks[]>>;
}) {
  const [comment, setComment] = useState("");
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

    editorProps: {
      attributes: {
        class:
          "prose prose-sm  focus:outline-none min-h-[100px] max-w-full pl-2",
      },
    },
    onTransaction: (props) => {
      setComment(props.editor?.getHTML());
    },
  });

  const { mutate: addComment } = api.comment.addComment.useMutation({
    onSuccess(value) {
      setSingleRequestData((prevTasks: any) => ({
        ...prevTasks,
        comments: [...prevTasks.comments, value],
      }));

      if (refetchAllRequest) {
        refetchAllRequest();
      }
    },
    onError(error) {
      toast.error("Something went wrong", {
        description: `${error.message}`,
      });
      fetchSingleTask();
      if (refetchAllRequest) {
        refetchAllRequest();
      }
    },
    onMutate(value) {
      setTasks &&
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  comments: [
                    ...task.comment,
                    {
                      comment: value.comment,
                      createdAt: new Date(),
                      id: nanoid(),
                    },
                  ],
                }
              : task,
          ),
        );
      editor?.commands.clearContent();
    },
  });

  const addCommentMutation = () => {
    const containsPTagsWithWhitespace = /^<p>(\s*)<\/p>( <p>(\s*)<\/p>)*$/.test(
      comment,
    );

    if (!containsPTagsWithWhitespace) {
      if (type === "TASK") {
        addComment({
          taskId: id,
          comment: comment,
        });
      }
      if (type === "SUBTASK") {
        addComment({
          subTaskId: id,
          comment: comment,
        });
      }
    }
  };
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-2 focus-within:ring-1 focus-within:ring-ring">
      <RichTextEditor
        editor={editor}
        className="max-h-32 min-h-12  overflow-scroll  rounded-lg border-0  shadow-none "
      >
        <RichTextEditor.Content className="relative w-full   " />
      </RichTextEditor>
      <div className="flex  items-center ">
        <Button
          onClick={addCommentMutation}
          type="submit"
          size="sm"
          className="ml-auto gap-1.5"
        >
          Add comment
          <LuCornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
