import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'

import { taskRouter } from './routers/task'
import { teamRouter } from './routers/team'
import { userRouter } from './routers/user'

export const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
  team: teamRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
