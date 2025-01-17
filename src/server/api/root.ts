import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";
import { teamRouter } from "./routers/team";
import { projectRouter } from "./routers/project";
import { statusRouter } from "./routers/status";

export const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
  team: teamRouter,
  project: projectRouter,
  status: statusRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
