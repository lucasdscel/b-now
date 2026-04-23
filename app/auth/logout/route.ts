// Route handler POST — cierra la sesión de Supabase y redirige al home.
// Invocado por el formulario HTML de "Cerrar sesión" desde el dashboard.

import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url)
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(`${origin}/`)
}
