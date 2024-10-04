import Document from '@tiptap/extension-document'

import { RichTextEditor } from '@mantine/tiptap'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { useEditor } from '@tiptap/react'
import React, { type Dispatch, type SetStateAction, useState } from 'react'

import Fuse from 'fuse.js'

import { api } from '@/utils/api'
import { nanoid } from 'nanoid'
import { useSession } from 'next-auth/react'
import { LuCornerDownLeft } from 'react-icons/lu'
import { toast } from 'sonner'
import { renderSuggestion } from './suggestion'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/project'
import {
  IPAllTaskData,
  type IPAllUserData,
  type IPSingleTaskData,
} from '@/types/projects'

const options = {
  includeScore: true,
  keys: ['data.label'],
  findAllMatches: true,
}

export function AddCommentToTask({
  id,
  data,
  fetchSingleTask,
  setSingleRequestData,
  refetchAllRequest,
}: {
  data: IPAllUserData['data']
  value?: string
  id: string
  setSingleRequestData: Dispatch<SetStateAction<IPSingleTaskData>>
  fetchSingleTask: any
  refetchAllRequest?: any
}) {
  const { updateAllTask } = useTaskStore()
  const session = useSession()
  const [comment, setComment] = useState('')
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: 'text-link',
        },
        suggestion: {
          render: renderSuggestion,
          items: ({ query }) => {
            if (query === '') {
              return data.flatMap((n) => n.data.map((i) => i.label))
            }
            return new Fuse(data, options)
              .search(query.toLocaleLowerCase())
              .map((n) => n.item.data.map((i) => i.label))
          },
        },

        renderLabel: ({ options, node }) => {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id
          }`
        },
      }),
      Placeholder.configure({
        placeholder: 'Add comment',
      }),
    ],

    editorProps: {
      attributes: {
        class:
          'prose prose-sm  focus:outline-none min-h-[100px] max-w-full pl-2',
      },
    },
    onTransaction: (props) => {
      setComment(props.editor?.getHTML())
    },
  })

  const { mutate: addComment } = api.task.addComment.useMutation({
    onSuccess(value) {
      setSingleRequestData((prevTasks: any) => ({
        ...prevTasks,
        comments: [...prevTasks.comments, value],
      }))

      if (refetchAllRequest) {
        refetchAllRequest()
      }
    },
    onError(error) {
      toast.error('Something went wrong', {
        description: `${error.message}`,
      })
      fetchSingleTask()
      if (refetchAllRequest) {
        refetchAllRequest()
      }
    },
    onMutate(value) {
      updateAllTask((prevTasks) => {
        return prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: nanoid(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user:
                      (session.data?.user.name || session.data?.user.email) ??
                      '', // Replace with actual user
                    userInitials:
                      (session.data?.user?.name?.charAt(0) ||
                        session.data?.user?.email?.charAt(0)) ??
                      '', // Set appropriately
                    BriefComment: value.comment,
                    designProjectBriefId: null,
                    marketingProjectBriefId: null,
                    developmentProjectBriefId: null,
                    customProjectBriefId: null,
                    customTaskId: null,
                  },
                ],
              }
            : task,
        )
      })

      editor?.commands?.clearContent()
    },
  })

  const addCommentMutation = () => {
    const containsPTagsWithWhitespace = /^<p>(\s*)<\/p>( <p>(\s*)<\/p>)*$/.test(
      comment,
    )

    if (!containsPTagsWithWhitespace) {
      addComment({
        taskId: id,
        comment: comment,
      })
    }
  }
  return (
    <div className="flex w-full gap-2">
      <div className="relative w-full overflow-hidden rounded-lg border bg-background p-2 focus-within:ring-1 focus-within:ring-ring">
        {editor && (
          <RichTextEditor
            editor={editor}
            className={cn(
              'max-h-32 min-h-12  overflow-scroll  rounded-lg border-0  shadow-none ',
            )}
          >
            <RichTextEditor.Content className="relative w-full   " />
          </RichTextEditor>
        )}

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
    </div>
  )
}

export type Task = {
  department: string
  status: string | null
  id: string
  notes: string | null
  projectTitle: string
  priority: string
  assigned_to: string
  projectObjective: string | null
  initials: string
  comments: {
    id?: string | null
    createdAt?: Date | null
    updatedAt?: Date | null
    user?: string | null
    userInitials?: string | null
    comment: string
    designRequestId?: string | null
    marketingRequestId?: string | null
    developmentRequestId?: string | null
    customRequestId?: string | null
  }[]
}
