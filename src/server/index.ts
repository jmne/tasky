import { projectRouter } from '@/server/routers/project';
import { taskRouter } from '@/server/routers/task';
import { userRouter } from '@/server/routers/user';
import { mergeRouters } from '@/server/trpc';

export const appRouter = mergeRouters(userRouter, taskRouter, projectRouter);

export type AppRouter = typeof appRouter;
