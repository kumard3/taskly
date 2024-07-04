import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        status: z
          .enum(["TO_DO", "IN_PROGRESS", "ISSUES", "COMPLETED", "OVERDUE"])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      return await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          createdBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          assigned_to: ctx.session.user.id,
          collaboratorIds: {
            set: [ctx.session.user.id],
          },
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "TO_DO",
          "IN_PROGRESS",
          "ISSUES",
          "COMPLETED",
          "OVERDUE",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return {
        task,
      };
    }),

  getAllTodoTasks: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    const tasks = await ctx.db.task.findMany({
      where: {
        assigned_to: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const todoTasks = tasks.filter((task) => task.status !== "COMPLETED");
    return todoTasks;
  }),
  getAllCompletedTasks: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const take = 5 + input.limit;
      const tasks = await ctx.db.task.findMany({
        where: {
          createdBy: {
            id: ctx.session.user.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: take,
      });
      const completedTasks = tasks.filter(
        (task) => task.status === "COMPLETED",
      );

      return completedTasks;
    }),
  getAllOverdueTasks: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    const tasks = await ctx.db.task.findMany({
      where: {
        assigned_to: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!tasks) throw new TRPCClientError("No tasks found");
    const overdueTasks = tasks.filter((task) => task.status === "OVERDUE");

    return overdueTasks;
  }),

  getSingleTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const task = await ctx.db.task.findUnique({
        where: {
          id: input.id,
        },
        include: {
          project: true,
          subTasks: true,
        },
      });
      const comments = await ctx.db.comment.findMany({
        where: {
          taskId: input.id,
        },
        select: {
          message: true,
          id: true,
        },
      });
      if (!task) throw new TRPCClientError("No task found");
      const collaborators = await ctx.db.user.findMany({
        where: {
          id: {
            in: task?.collaboratorIds,
          },
        },
        select: {
          id: true,
          image: true,
          name: true,
        },
      });
      if (task?.assigned_to) {
        const assignedToUser = await ctx.db.user.findUnique({
          where: {
            id: task?.assigned_to,
          },
          select: {
            id: true,
            image: true,
            name: true,
          },
        });
        if (!assignedToUser) throw new TRPCClientError("No assignee found!");
        return {
          ...task,
          collaborators: collaborators,
          assigned_to: {
            id: assignedToUser.id,
            image: assignedToUser.image,
            name: assignedToUser.name,
          },
        };
      }
      return {
        ...task,
        collaborators: collaborators,
        assigned_to: null,
        comments: comments,
      };
    }),

  getSingleTaskComments: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      return await ctx.db.comment.findMany({
        where: {
          taskId: input.id,
        },
        include: {
          user: true,
        },
      });
    }),
  getSingleTaskCollaborators: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const task = await ctx.db.task.findUnique({
        where: {
          id: input.taskId,
        },
      });
      if (!task) throw new TRPCClientError("No task found");
      const collaborators = await ctx.db.user.findMany({
        where: {
          id: {
            in: task?.collaboratorIds,
          },
        },
        select: {
          id: true,
          image: true,
          name: true,
        },
      });
      return { collaborators: collaborators };
    }),

  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      await ctx.db.task.delete({
        where: {
          id: input.id,
        },
      });
      return {
        message: "Task deleted successfully",
      };
    }),

  updateAssignee: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        assigned_to: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const assignee = await ctx.db.user.findUnique({
        where: {
          id: input.assigned_to,
        },
        select: {
          id: true,
          image: true,
          name: true,
        },
      });
      if (!assignee) throw new TRPCClientError("No assignee found");
      await ctx.db.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          assigned_to: input?.assigned_to,
          initials: assignee.name,
        },
      });
      return {
        message: "Assignee updated successfully",
      };
    }),

  addOrUpdateCollaborators: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),

        collaborators: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      await ctx.db.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          collaboratorIds: {
            set: input.collaborators,
          },
        },
      });
      return {
        message: "Collaborators updated successfully",
      };
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        taskId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const userData = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
        },
      });
      if (userData?.name === null) {
        throw new TRPCClientError("No user found");
      }

      return await ctx.db.comment.create({
        data: {
          message: input.comment,
          taskId: input.taskId,
          userId: ctx.session.user.id,
        },
      });
    }),

  addDescription: protectedProcedure
    .input(z.object({ taskId: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const task = await ctx.db.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          description: input.description,
        },
      });
      return task;
    }),

  getSingleDescription: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const task = await ctx.db.task.findUnique({
        where: {
          id: input.taskId,
        },
        select: {
          description: true,
        },
      });
      return task;
    }),

  getAllTaskAssignedToUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    const tasks = await ctx.db.task.findMany({
      where: {
        assigned_to: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  }),

  getAllTasks: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    const tasks = await ctx.db.task.findMany({
      where: {
        assigned_to: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  }),
  getAllTask: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    return await ctx.db.task.findMany({
      where: {
        assigned_to: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
