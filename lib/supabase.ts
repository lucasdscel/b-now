/**
 * Helpers de conversión snake_case ↔ camelCase.
 *
 * CLIENTES disponibles:
 *   Server Components / Actions / Route Handlers → import { createClient } from '@/lib/supabase/server'
 *   Client Components ('use client')             → import { createClient } from '@/lib/supabase/client'
 *
 * PATRÓN DE USO
 * ─────────────
 * Lectura — fetchCamel convierte la respuesta a camelCase:
 *
 *   const supabase = createClient()   // server o client según contexto
 *   const profesionales = await fetchCamel<Profesional[]>(
 *     supabase.from('profesionales').select('*').eq('activo', true)
 *   )
 *
 * Escritura — toSnake convierte el objeto antes de enviarlo:
 *
 *   await supabase.from('profesionales').insert(
 *     toSnake({ nombre: 'Ana', avatarUrl: '...', ciudadId: 1 })
 *   )
 *
 * IMPORTANTE: los filtros siguen en snake_case porque van directo a Postgres:
 *   .eq('ciudad_id', 1)   ✓
 *   .eq('ciudadId', 1)    ✗
 */

import type { PostgrestError } from '@supabase/supabase-js'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

/**
 * Ejecuta una query de Supabase y devuelve la data convertida a camelCase.
 * Lanza un error si la query falla.
 */
export async function fetchCamel<T>(
  query: PromiseLike<{ data: unknown; error: PostgrestError | null }>
): Promise<T> {
  const { data, error } = await query

  if (error) throw error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return camelcaseKeys(data as any, { deep: true }) as T
}

/**
 * Convierte un objeto camelCase a snake_case para usar en insert/update.
 */
export function toSnake<T extends Record<string, unknown>>(obj: T) {
  return snakecaseKeys(obj, { deep: true })
}
