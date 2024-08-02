import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'

/**
 * Function to update the session using Supabase.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response object after updating the session.
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                /**
                 * Get all cookies from the request.
                 *
                 * @returns {Array} An array of cookies.
                 */
                getAll() {
                    return request.cookies.getAll()
                },
                /**
                 * Set multiple cookies in the request and response.
                 *
                 * @param {Array} cookiesToSet - An array of cookies to set.
                 */
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value, options}) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({name, value, options}) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: {user},
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/signup') &&
        !request.nextUrl.pathname.startsWith('/auth')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
