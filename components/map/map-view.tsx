'use client'
// Componente de mapa base usando react-map-gl v7 + Mapbox GL JS v3.
// Sin markers por ahora — solo renderiza el mapa con el estilo configurado.
// Debe cargarse con ssr:false porque mapbox-gl accede a window/document.

import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getMapboxToken, MAPBOX_STYLE, CENTRO_SANTIAGO } from '@/lib/mapbox/config'

interface ViewState {
  latitude: number
  longitude: number
  zoom: number
}

interface MapViewProps {
  initialViewState?: ViewState
  height?: string
  className?: string
}

export default function MapView({
  initialViewState = CENTRO_SANTIAGO,
  height = '400px',
  className,
}: MapViewProps) {
  return (
    <div style={{ height }} className={className}>
      <Map
        mapboxAccessToken={getMapboxToken()}
        mapStyle={MAPBOX_STYLE}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
