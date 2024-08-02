'use server'

import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'

/**
 * Logs in a user using their email and password.
 *
 * @param {Object} data - The login data.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {Promise<string|void>} - Returns an error message if login fails, otherwise redirects to the home page.
 */
export async function login(data: { email: string; password: string }) {
    const supabase = createClient()

    const {error} = await supabase.auth.signInWithPassword(data)

    if (error) {
        return error.message
    }

    redirect('/')
}
