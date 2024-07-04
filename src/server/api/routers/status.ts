import { TRPCClientError } from "@trpc/client";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const statusRouter = createTRPCRouter({
  getAllStatusForUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id) {
      throw new TRPCClientError("User not found! Please log in.");
    }
    const status = await ctx.db.customStatus.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        status: true,
      },
    });

    const projectStatus = status?.status.map((n) => {
      return {
        label: n?.replaceAll("_", " "),
        value: n,
      };
    });
    return projectStatus;
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
      const prev = await ctx.db.customStatus.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          status: true,
        },
      });

      if (prev) {
        await ctx.db.customStatus.create({
          data: {
            userId: ctx.session.user.id,

            status: {
              set: [...prev?.status, input.status.replaceAll(" ", "_")],
            },
          },
        });
        return "Status added successfully.";
      }
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


});
