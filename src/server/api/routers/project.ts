import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  allProjects: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    return await ctx.db.project.findMany({
      select: {
        name: true,
        id: true,
      },
    });
  }),
  getSingleProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.projectId,
        },
        include: {
          tasks: true,
        },
      });
      if (!project) throw new TRPCClientError("No project found");
      return project;
    }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      return await ctx.db.project.create({
        data: {
          name: input.name,
        },
      });
    }),

  connectTask: protectedProcedure
    .input(z.object({ taskId: z.string(), projectId: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      return await ctx.db.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          project: {
            connect: input.projectId.map((id) => ({ id })),
          },
        },
      });
    }),
});
