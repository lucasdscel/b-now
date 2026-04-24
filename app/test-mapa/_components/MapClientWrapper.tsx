'use client'
// Wrapper client que carga MapView dinámicamente con ssr:false.
// Necesario porque mapbox-gl accede a window/document y no puede ejecutarse en el servidor.

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/map/map-view'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-lg border bg-muted animate-pulse"
      style={{ height: '500px' }}
      aria-label="Cargando mapa..."
    />
  ),
})

export default function MapClientWrapper() {
  return <MapView height="500px" />
}
