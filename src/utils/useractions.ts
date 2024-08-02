'use server'

import {cookies} from "next/headers";
import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'


/**
 * Logs out the current user.
 *
 * @returns {Promise<Object|void>} - Returns an error object if logout fails, otherwise deletes the authentication token and redirects to the home page.
 */
export async function logout() {
    const supabase = createClient()

    const {error} = await supabase.auth.signOut()
    cookies().delete('sb:token')

    if (error) {
        return error
    }

    redirect('/')
}
