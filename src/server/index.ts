import {projectRouter} from '@/server/routers/project';
import {taskRouter} from '@/server/routers/task';
import {userRouter} from '@/server/routers/user';
import {mergeRouters} from '@/server/trpc';

/**
 * Merges the user, task, and project routers into a single application router.
 *
 * @constant
 * @type {Router}
 */
export const appRouter = mergeRouters(userRouter, taskRouter, projectRouter);

/**
 * Type definition for the application router.
 *
 * @typedef {typeof appRouter} AppRouter
 */
export type AppRouter = typeof appRouter;
