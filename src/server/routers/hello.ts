import { z } from 'zod';

import { procedure, router } from '@/server/trpc';

export const helloRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((ctx) => {
      return {
        greeting: `hello ${ctx.ctx.user}`,
      };
    }),
});
