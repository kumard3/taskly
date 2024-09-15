import type { RouterOutputs } from '@/utils/api'
import type { Comment, Task } from '@prisma/client'
import { z } from 'zod'

export const createWorkspaceFromValue = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name must be at least 1 characters.' }),
})

export const createProjectFromValue = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  workSpaceId: z.string().optional(),
  assigned_to: z.string().optional(),
  status: z.string().optional(),
  parentTaskId: z.string().optional(), // Add this for subtasks
  collaborators: z.string().array().optional(),
  tempTaskId: z.string().optional(),
})
export const updateProjectValue = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  assigned_to: z.string().optional(),
  status: z.string().optional(),
  parentTaskId: z.string().optional(),
  collaborators: z.string().array().optional(),
  workSpaceId: z.string().optional(),
})

export type IPCreateWorkspaceFromValue = z.infer<
  typeof createWorkspaceFromValue
>
export type IPCreateProjectFromValue = z.infer<typeof createProjectFromValue>

export type IPUpdateFormValue = z.infer<typeof updateProjectValue>
export type IPUpdateFormValueKeys = keyof IPUpdateFormValue

export type IPSingleTaskData = RouterOutputs['task']['getTaskById']

type IPSubTaskType = Omit<Task, 'updatedAt'>

export interface IPAllTaskData extends Omit<Task, 'updatedAt'> {
  comments: Comment[]
  attachments: {
    id: string
    name: string | null
    url: string | null
    type: string | null
  }[]

  subTasks: IPSubTaskType[]
}

export type IPAllUserData = { data: []; allData: [] }
