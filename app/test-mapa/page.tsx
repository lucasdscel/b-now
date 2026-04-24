// Página de prueba del mapa Mapbox. Eliminar una vez validado en producción.

import MapClientWrapper from './_components/MapClientWrapper'

export const metadata = { title: 'Test de mapa BeautyNow' }

export default function TestMapaPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Test de mapa BeautyNow</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mapa centrado en Santiago · zoom 11 · estilo custom Mapbox Studio
        </p>
      </div>
      <div className="rounded-xl overflow-hidden border shadow-sm">
        <MapClientWrapper />
      </div>
    </div>
  )
}
