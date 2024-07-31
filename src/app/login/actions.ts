'use server'

import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'
import {cookies} from "next/headers";

export async function login(data: { email: string; password: string }) {
    const supabase = createClient()

    const {error} = await supabase.auth.signInWithPassword(data)

    if (error) {
        return error.message
    }

    redirect('/')
}

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

export async function logout() {
    const supabase = createClient()


    const {error} = await supabase.auth.signOut()
    cookies().delete('sb:token')

    if (error) {
        return error
    }

    redirect('/')
}
