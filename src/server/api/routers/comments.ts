import { TRPCClientError } from "@trpc/client";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        taskId: z.string().optional(),
        subTaskId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCClientError("No organization found for this user.");
      }

      try {
        if (input.subTaskId) {
          return await ctx.db.comment.create({
            data: {
              message: input.comment,
              subTaskId: input.subTaskId,
              userId: ctx.session.user.id ?? "",
            },
          });
        } else if (input.taskId) {
          return await ctx.db.comment.create({
            data: {
              message: input.comment,
              taskId: input.taskId,
              userId: ctx.session.user.id ?? "",
            },
          });
        }
      } catch (e) {
        throw new TRPCClientError("No request found with this id.");
      }
    }),

  getSingleTaskComments: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
});
