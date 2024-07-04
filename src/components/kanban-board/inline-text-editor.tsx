import React from "react";

import { EditorState, Editor ,ContentState} from "draft-js";


export default function InlineTextEditor({ value }: { value: string }) {
  const _contentState = ContentState.createFromText(value);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createWithContent(_contentState),
  );
  return (
    <div className=" rounded-lg border-2 border-transparent px-1 duration-300 ease-in-out hover:border-2 hover:border-white/50 ">
      <Editor
        onChange={setEditorState}
        editorState={editorState}
        placeholder="Enter the title"
      />
    </div>
  );
}
