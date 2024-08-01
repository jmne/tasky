import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

import {Database} from '../../../types/supabase';

/**
 * Function to create a Supabase client for server-side usage.
 *
 * @returns {ReturnType<typeof createServerClient>} The Supabase client instance.
 */
export function createClient() {
    const cookieStore = cookies();

    return createServerClient<Database>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                /**
                 * Get all cookies from the cookie store.
                 *
                 * @returns {Array} An array of cookies.
                 */
                getAll() {
                    return cookieStore.getAll();
                },
                /**
                 * Set multiple cookies in the cookie store.
                 *
                 * @param {Array} cookiesToSet - An array of cookies to set.
                 */
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
            db: {
                schema: 'public',
            },
        }
    );
}
