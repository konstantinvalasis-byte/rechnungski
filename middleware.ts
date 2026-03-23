import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Geschützte Routen — nur für eingeloggte Nutzer
  const geschuetzteRouten = ['/dashboard']
  const istGeschuetzt = geschuetzteRouten.some(route =>
    pathname.startsWith(route)
  )

  if (istGeschuetzt && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Eingeloggte Nutzer nicht zur Login/Register-Seite lassen
  const authRouten = ['/login', '/registrieren']
  const istAuthRoute = authRouten.some(route => pathname.startsWith(route))

  if (istAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
