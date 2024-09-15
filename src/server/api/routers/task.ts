import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import {
  type IPAllTaskData,
  createProjectFromValue,
  updateProjectValue,
} from '@/types/projects'
import { TRPCClientError } from '@trpc/client'
import { z } from 'zod'

export const taskRouter = createTRPCRouter({
  getAllTasks: protectedProcedure
    .input(
      z.object({
        workSpaceId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const taskData: IPAllTaskData[] = []

      const tasks = await ctx.db.task.findMany({
        where: {
          id: ctx.session.user.id,
          parentTaskId: null,
          AND: [
            {
              workSpaceId: input.workSpaceId,
            },
          ],
        },
        select: {
          id: true,
          title: true,
          dueDate: true,
          priority: true,
          status: true,
          assignedTo: true,
          parentTaskId: true,
          collaborators: true,
          createdAt: true,
          description: true,
          comments: true,

          attachments: {
            select: {
              id: true,
              name: true,
              url: true,
              type: true,
            },
          },
          workSpaceId: true,
          subTasks: true,
          columnPosition: true,
          createdById: true,
          projectId: true,
        },
      })
      taskData.push(
        ...tasks.map((task) => {
          return {
            ...task,
          }
        }),
      )
      return taskData
    }),

  getAllStatus: protectedProcedure
    .input(
      z.object({
        workSpaceId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const projectStatus = await ctx.db.workspace
        .findUnique({
          where: {
            id: input.workSpaceId,
          },
          select: {
            CustomStatus: true,
          },
        })
        .CustomStatus({
          select: {
            name: true,
          },
        })
        .then((status) => {
          return status?.map((item) => {
            return {
              label: item?.name?.replaceAll('_', ' ') ?? '',
              value: item.name ?? '',
            }
          })
        })
      return projectStatus
    }),

  createTask: protectedProcedure
    .input(createProjectFromValue)
    .mutation(async ({ ctx, input }) => {
      const {
        title,
        description,
        dueDate,
        priority,
        assigned_to,
        workSpaceId,
        parentTaskId,
        status,
        collaborators,
      } = input

      const project = await ctx.db.task.create({
        data: {
          title,
          description,
          dueDate,
          priority,
          workSpaceId,
          assignedTo: assigned_to,
          status,
          collaborators,
          createdById: ctx.session.user.id,
          parentTaskId,
        },
      })

      if (!project) {
        throw new TRPCClientError('Failed to create project')
      }

      return { ...project, tempTaskId: input.tempTaskId }
    }),
  getTaskById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCClientError('Task id is required')
      }

      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: {
          subTasks: {
            select: {
              id: true,
              title: true,
              assignedTo: true,
              status: true,
              // dependenciesAsDependencyTask: true,
              // dependenciesAsDependentTask: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          parentTask: {
            select: {
              id: true,
              title: true,
              assignedTo: true,
              status: true,

              // dependenciesAsDependencyTask: true,
              // dependenciesAsDependentTask: true,
            },
          },
          dependenciesAsDependentTask: {
            include: { dependencyTask: true },
          },
          dependenciesAsDependencyTask: {
            include: { dependentTask: true },
          },
          comments: {
            orderBy: {
              createdAt: 'desc',
            },
          },

          attachments: {
            select: {
              id: true,
              name: true,
              url: true,
              type: true,
            },
          },
        },
      })
      if (task) {
        return {
          ...task,
        }
      }
      throw new TRPCClientError('Task not found')
    }),
  updateTask: protectedProcedure
    .input(updateProjectValue)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        title,
        description,
        dueDate,
        priority,
        assigned_to,
        parentTaskId,
        collaborators,
        workSpaceId,
        status,
      } = input

      const task = await ctx.db.task.update({
        where: { id },
        data: {
          title,
          description,
          dueDate,
          priority,
          assignedTo: assigned_to,
          parentTaskId,
          collaborators,
          status,
          workSpaceId,
        },
      })

      if (!task) {
        throw new TRPCClientError('Failed to update task')
      }

      return 'Task updated successfully'
    }),

  updateFileToProject: protectedProcedure
    .input(
      z.object({
        attachment: z.object({
          name: z.string(),
          url: z.string(),
          type: z.string(),
        }),

        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { attachment } = input

      const fileUpload = await ctx.db.fileUpload.create({
        data: {
          ...attachment,
          taskId: input.taskId,
        },
        select: {
          id: true,
          name: true,
          url: true,
          type: true,
        },
      })

      if (!fileUpload) {
        throw new TRPCClientError('Failed to upload file')
      }
      return fileUpload
      // throw new TRPCClientError("No request found with this id.");
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.delete({
        where: { id: input.id },
      })

      if (!task) {
        throw new TRPCClientError('Failed to delete task')
      }

      return 'Task deleted successfully'
    }),

  createCustomStatus: protectedProcedure
    .input(z.object({ name: z.string(), workSpaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input
      const customStatus = await ctx.db.customStatus.create({
        data: {
          name,
          WorkSpace: {
            connect: {
              id: input.workSpaceId,
            },
          },
        },
      })

      if (!customStatus) {
        throw new TRPCClientError('Failed to create custom status')
      }

      return 'Custom status created successfully'
    }),
  deleteCustomStatus: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const customStatus = await ctx.db.customStatus.delete({
        where: {
          id: input.id,
        },
      })

      if (!customStatus) {
        throw new TRPCClientError('Failed to delete custom status')
      }

      return 'Custom status deleted successfully'
    }),

  updateCustomStatus: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const customStatus = await ctx.db.customStatus.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name.replaceAll(' ', '_'),
        },
      })

      if (!customStatus) {
        throw new TRPCClientError('Failed to update custom status')
      }

      return 'Custom status updated successfully'
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        status: z.string(),
        requestId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const status = await ctx.db.task.update({
        where: {
          id: input.requestId,
        },
        data: {
          status: input.status,
        },
      })

      if (!status) {
        throw new TRPCClientError('Failed to update status')
      }

      return 'Status updated successfully'
    }),
  addComment: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCClientError('No user found for this session.')
      }
      const initials = ctx?.session?.user?.email
      const comment = await ctx.db.comment.create({
        data: {
          message: input.comment,
          userId: ctx.session.user.id,
          userInitials: initials,
          taskId: input.taskId,
        },
      })

      if (!comment) {
        throw new TRPCClientError('Failed to add comment')
      }

      return comment
    }),
})
