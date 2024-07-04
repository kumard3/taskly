import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";

import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";

export default function EmailInput({
  setEmail,
}: {
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  email?: string;
}) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,

      Placeholder.configure({
        placeholder: "Add email",
      }),
    ],

    editorProps: {
      attributes: {
        class: "prose prose-sm prose min-h-[100px] max-w-full pl-2",
      },
    },
    onTransaction: (props) => {
      setEmail && setEmail(props.editor?.getHTML());
    },
  });

  return (
    <div className="">
      <RichTextEditor
        editor={editor}
        className="relative flex  w-full items-center overflow-scroll "
      >
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}
