import {createBrowserClient} from '@supabase/ssr'

import {Database} from "../../../types/supabase";

export function createClient() {
    return createBrowserClient<Database>(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export const supabase = createClient()
