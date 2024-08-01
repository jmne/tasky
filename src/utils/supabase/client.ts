import {createBrowserClient} from '@supabase/ssr';

import {Database} from '../../../types/supabase';

/**
 * Function to create a Supabase client for browser-side usage.
 *
 * @returns {ReturnType<typeof createBrowserClient>} The Supabase client instance.
 */
export function createClient() {
    return createBrowserClient<Database>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

/**
 * The Supabase client instance created using the createClient function.
 */
export const supabase = createClient();
