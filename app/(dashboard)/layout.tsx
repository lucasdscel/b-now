// Layout de todas las rutas /dashboard/*.
// Server Component — verifica autenticación y completitud del perfil antes de renderizar.
// Defensa en profundidad: el middleware ya bloquea sin sesión, pero verificamos igualmente.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfesionalActual } from '@/lib/auth/get-profesional'
import DashboardShell from './_components/DashboardShell'

function perfilCompleto(p: {
  nombre: string
  apellido: string
  ciudad_id: number | null
  especialidades: string[]
}): boolean {
  return Boolean(p.nombre && p.apellido && p.ciudad_id !== null && p.especialidades.length > 0)
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Validamos la sesión directamente para obtener también el email del auth user,
  // que no está disponible en la tabla profesionales sin JOIN a auth.users.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profesional = await getProfesionalActual()

  if (!profesional) {
    redirect('/registro-profesional')
  }

  if (!perfilCompleto(profesional)) {
    redirect('/registro-profesional?incompleto=1')
  }

  return (
    <DashboardShell profesional={profesional} userEmail={user.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
