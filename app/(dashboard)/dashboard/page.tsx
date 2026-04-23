// Página principal del dashboard — resumen de actividad del profesional.
// Server Component — muestra rating_promedio real y placeholders de métricas futuras.

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProfesionalActual } from '@/lib/auth/get-profesional'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Dashboard' }

const METRICS = [
  {
    key: 'visitas',
    title: 'Visitas a tu perfil',
    sub: 'últimos 30 días',
  },
  {
    key: 'solicitudes',
    title: 'Solicitudes recibidas',
    sub: 'últimos 30 días',
  },
  {
    key: 'reservas',
    title: 'Reservas confirmadas',
    sub: 'este mes',
  },
] as const

export default async function DashboardPage() {
  const profesional = await getProfesionalActual()
  if (!profesional) redirect('/login')

  const ratingLabel =
    profesional.rating_promedio != null
      ? profesional.rating_promedio.toFixed(1)
      : '—'

  const reviewsLabel =
    profesional.total_reviews === 1 ? '1 reseña' : `${profesional.total_reviews} reseñas`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bienvenida, {profesional.nombre}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aquí tienes un resumen de tu actividad en BeautyNow.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {METRICS.map(({ key, title, sub }) => (
          <Card key={key}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}

        {/* Rating — dato real de la DB */}
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
              Rating promedio
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{ratingLabel}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{reviewsLabel}</p>
          </CardContent>
        </Card>
      </div>

      {/* CTA para completar perfil */}
      <Card className="border-dashed">
        <CardContent className="py-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Completa tu perfil agregando servicios y fotos para empezar a recibir clientas.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild style={{ backgroundColor: '#D4537E' }} className="text-white">
              <Link href="/dashboard/servicios">Agregar servicios</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/fotos">Subir fotos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
