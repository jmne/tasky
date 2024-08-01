'use server'

import {revalidatePath} from 'next/cache'
import {cookies} from "next/headers";
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

/**
 * Signs up a new user using the provided form data.
 *
 * @param {FormData} formData - The form data containing email and password.
 * @returns {Promise<Object|void>} - Returns an error object if signup fails, otherwise revalidates the path and redirects to the home page.
 */
export async function signup(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const {error} = await supabase.auth.signUp(data)

    if (error) {
        return error
    }

    revalidatePath('/')
    redirect('/')
}

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
