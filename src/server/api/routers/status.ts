import { TRPCClientError } from "@trpc/client";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const statusRouter = createTRPCRouter({
  getAllStatusForUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) {
      throw new TRPCClientError("User not found! Please log in.");
    }
    const status = await ctx.db.customStatus.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        status: true,
        id: true,
      },
    });
    return status;
  }),
  createStatus: protectedProcedure
    .input(
      z.object({
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCClientError("User not found! Please log in.");
      }
      return await ctx.db.customStatus.create({
        data: {
          status: input.status,
          userId: ctx.session.user.id,
        },
      });
    }),
  deleteStatus: protectedProcedure
    .input(
      z.object({
        statusId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCClientError("User not found! Please log in.");
      }
      return await ctx.db.customStatus.delete({
        where: {
          id: input.statusId,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        statusId: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id) {
        throw new TRPCClientError("User not found! Please log in.");
      }
      return await ctx.db.customStatus.update({
        where: {
          id: input.statusId,
        },
        data: {
          status: input.status,
        },
      });
    }),

    
});
