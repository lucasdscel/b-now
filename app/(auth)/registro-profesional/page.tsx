// Placeholder del wizard de registro para profesionales.
// El usuario llega aquí autenticado pero sin perfil en la tabla profesionales.
// Muestra el email de la sesión activa para confirmar que el magic link funcionó.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Registro de profesional' }

export default async function RegistroProfesionalPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Completa tu registro como profesional</h1>
        <p className="text-muted-foreground text-sm">
          Próximamente: wizard de 4 pasos
        </p>
      </div>

      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
        Sesión activa como:{' '}
        <span className="font-semibold text-foreground">{user.email}</span>
      </div>

      <form action="/auth/logout" method="post">
        <Button type="submit" variant="ghost" className="text-muted-foreground">
          Cerrar sesión
        </Button>
      </form>
    </div>
  )
}
