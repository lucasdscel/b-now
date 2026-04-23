// Helper para Server Components y Server Actions.
// Devuelve el perfil completo del profesional autenticado, o null si no hay sesión.

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type ProfesionalRow = Database['public']['Tables']['profesionales']['Row']

// El campo plan en la DB es TEXT con CHECK constraint — lo narramos con este tipo.
export type Plan = 'free' | 'pro' | 'premium'
export type ProfesionalActual = Omit<ProfesionalRow, 'plan'> & { plan: Plan }

export async function getProfesionalActual(): Promise<ProfesionalActual | null> {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data, error } = await supabase
    .from('profesionales')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  return data as ProfesionalActual
}
