import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/server';
import { createTRPCContext } from '@/server/trpc';

/**
 * Handles incoming requests for the tRPC API.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<Response>} - The response from the tRPC handler.
 */
const handler = async (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api',
        req,
        router: appRouter,
        createContext: () => createTRPCContext(req),
    });

export { handler as GET, handler as POST };
