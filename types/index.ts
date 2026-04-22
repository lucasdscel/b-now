import type { Database } from './database'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type EstadoReserva   = Database['public']['Enums']['estado_reserva']
export type TipoContacto    = Database['public']['Enums']['tipo_contacto']
export type PlanProfesional = 'free' | 'pro' | 'premium'

// ─── Tipos de dominio (camelCase) ─────────────────────────────────────────────
// Reflejo de los Row de database.ts con claves convertidas a camelCase.
// Estos son los tipos que usan componentes y páginas.

export type Ciudad = {
  id: number
  nombre: string
  slug: string
  region: string
  pais: string
  activa: boolean
  createdAt: string
}

export type Profesional = {
  id: string
  userId: string | null
  nombre: string
  apellido: string
  slug: string
  bio: string | null
  telefono: string | null
  email: string | null
  avatarUrl: string | null
  ciudadId: number | null
  comuna: string | null
  direccion: string | null
  lat: number | null
  lng: number | null
  especialidades: string[]
  instagramUrl: string | null
  whatsapp: string | null
  activo: boolean
  verificado: boolean
  plan: PlanProfesional
  ratingPromedio: number | null
  totalReviews: number
  createdAt: string
  updatedAt: string
}

export type Servicio = {
  id: string
  profesionalId: string
  nombre: string
  descripcion: string | null
  duracionMinutos: number
  precio: number | null
  precioDesde: number | null
  activo: boolean
  createdAt: string
  updatedAt: string
}

export type Foto = {
  id: string
  profesionalId: string
  url: string
  descripcion: string | null
  esPortada: boolean
  orden: number
  createdAt: string
}

export type DisponibilidadSlot = {
  id: string
  profesionalId: string
  diaSemana: number
  horaInicio: string
  horaFin: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export type Reserva = {
  id: string
  profesionalId: string
  servicioId: string | null
  clienteUserId: string | null
  clienteNombre: string
  clienteEmail: string | null
  clienteTelefono: string | null
  fecha: string
  horaInicio: string
  horaFin: string
  estado: EstadoReserva
  notas: string | null
  precioAcordado: number | null
  createdAt: string
  updatedAt: string
}

export type ContactEvent = {
  id: string
  profesionalId: string
  tipo: TipoContacto
  clienteUserId: string | null
  ciudadId: number | null
  ipHash: string | null
  referrer: string | null
  createdAt: string
}

export type Review = {
  id: string
  profesionalId: string
  reservaId: string | null
  clienteUserId: string | null
  clienteNombre: string | null
  puntuacion: number
  comentario: string | null
  respuestaProfesional: string | null
  publicada: boolean
  createdAt: string
  updatedAt: string
}
