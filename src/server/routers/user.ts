import { z } from 'zod';

import { procedure, router } from '@/server/trpc';
import { createClient } from '@/utils/supabase/client';

import { Tables } from '../../../types/supabase';

export const userRouter = router({
  getUser: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      // Retrieve the user with the given ID
      const db = createClient();
      const user = await db
        .from('profile')
        .select('*')
        .eq('id', input.id)
        .returns<Tables<'profile'>>();

      return user.data;
    }),
});
