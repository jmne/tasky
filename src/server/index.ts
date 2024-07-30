import { helloRouter } from '@/server/routers/hello';
import { projectRouter } from '@/server/routers/project';
import { taskRouter } from '@/server/routers/task';
import { userRouter } from '@/server/routers/user';
import { mergeRouters } from '@/server/trpc';

export const appRouter = mergeRouters(
  userRouter,
  helloRouter,
  taskRouter,
  projectRouter
);

export type AppRouter = typeof appRouter;
