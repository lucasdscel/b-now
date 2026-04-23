// Route handler GET para el callback de Supabase Auth (PKCE flow).
// Supabase redirige aquí con ?code=... después de que el profesional
// hace click en el magic link de su correo.

import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Sin código o con error: volver a login con flag de error en la URL
  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
