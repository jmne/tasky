import {z} from 'zod';

import {procedure, router} from '@/server/trpc';
import {createClient} from '@/utils/supabase/client';

import {Tables} from '../../../types/supabase';

/**
 * Router for user-related operations.
 */
export const userRouter = router({
    /**
     * Procedure to get a user by ID.
     *
     * @param {Object} input - The input object.
     * @param {string} input.id - The ID of the user to retrieve.
     * @returns {Promise<Object|null>} The user data or null if not found.
     */
    getUser: procedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async (opts) => {
            const {input} = opts;

            // Retrieve the user with the given ID
            const db = createClient();
            const user = await db
                .from('profile')
                .select('*')
                .eq('id', input.id)
                .single<Tables<'profile'>>();

            return user.data;
        }),

    /**
     * Procedure to get all users.
     *
     * @returns {Promise<Array<Object>>} An array of user data.
     */
    getAllUser: procedure.query(async () => {
        // Retrieve all users
        const db = createClient();
        const user = await db
            .from('profile')
            .select('*')
            .returns<Tables<'profile'>[]>();

        return user.data;
    }),
});
