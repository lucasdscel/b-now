// Punto de entrada del middleware de Next.js.
// Delega el refresco de sesión a lib/supabase/middleware.ts.
// La protección de rutas (/dashboard, /admin) se hace en los layouts correspondientes
// usando getProfesionalActual() — si retorna null, redirigir a /login.

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // Aplica a todas las rutas excepto assets estáticos.
    // Correr en todas las rutas (no solo /dashboard) garantiza que el token
    // se refresque en cualquier navegación antes de llegar a rutas protegidas.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
