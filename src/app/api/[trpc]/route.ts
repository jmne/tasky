import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/server';
import { createTRPCContext } from '@/server/trpc';

const handler = async (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
