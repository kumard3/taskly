/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import { MentionList } from "./MentionList";
// Import MentionList from appropriate path

// const items = ({ query,data }: {query:any,data:[]}) => {
//   return data
//     .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
//     .slice(0, 5);
// };

export const renderSuggestion = () => {
  let reactRenderer: any;
  let popup: any;

  return {
    onStart: (props: any) => {
      if (!props.clientRect) {
        return;
      }

      reactRenderer = new ReactRenderer(MentionList, {
        props,
        editor: props.editor,
      });

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: reactRenderer.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },

    onUpdate: (props: any) => {
      reactRenderer.updateProps(props);

      if (!props.clientRect) {
        return;
      }
      popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown: (props: any) => {
      if (props.event.key === "Escape") {
        popup[0].hide();
        return true;
      }

      return reactRenderer.ref?.onKeyDown(props);
    },

    onExit: () => {
      popup[0].destroy();
      reactRenderer.destroy();
    },
  };
};

// export default {
//   items,
//   renderSuggestion,
// };
