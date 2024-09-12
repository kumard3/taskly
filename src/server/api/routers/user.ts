import { TRPCClientError } from "@trpc/client";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  allUsers: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
    return await ctx.db.user.findMany();
  }),

  createWorkspace: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user.id)
      throw new TRPCClientError("User not found! Please log in.");
 
  }),
});
