// Refresca el token de sesión de Supabase en cada request y propaga las cookies
// actualizadas al response. Importado por middleware.ts en la raíz del proyecto.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
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

  // Validar el token contra el servidor de Supabase.
  // No usar getSession() aquí — no valida el JWT contra el servidor y puede devolver
  // una sesión falsa si las cookies fueron manipuladas.
  await supabase.auth.getUser()

  return supabaseResponse
}
