"use server"
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

import {createClient} from "@/utils/supabase/server";

/**
 * Signs up a new user using the provided form data.
 *
 * @param {FormData} formData - The form data containing email and password.
 * @returns {Promise<Object|void>} - Returns an error object if signup fails, otherwise revalidates the path and redirects to the home page.
 */
export async function signup({email, password, username}: { email: string, password: string, username: string }) {
    const supabase = createClient()

    const formdata = {
        email: email,
        password: password,
        options: {
            data: {
                username: username
            }
        }
    }

    const {error} = await supabase.auth.signUp(formdata)

    if (error) {
        return error.message
    }

    revalidatePath('/')
    redirect('/')


}
