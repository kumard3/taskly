import { TRPCClientError } from "@trpc/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
  allTeam: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    return await ctx.db.team.findMany();
  }),
  createTeam: protectedProcedure
    .input(z.object({ name: z.string(), members: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.id)
        throw new TRPCClientError("User not found! Please log in.");
      return await ctx.db.team.create({
        data: {
          teamName: input.name,
          members: {
            connect: input.members.map((id) => ({ id })),
          },
        },
      });
    }),
});
