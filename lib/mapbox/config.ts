// Centraliza la configuración de Mapbox.
// Importar desde aquí en lugar de leer process.env directamente en los componentes.
// La validación del token se hace en runtime (browser) para no cortar el build.

export function getMapboxToken(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) {
    throw new Error(
      'NEXT_PUBLIC_MAPBOX_TOKEN no está definido. ' +
        'Agrégalo a .env.local con el token público (pk.xxx) de Mapbox.'
    )
  }
  return token
}

export const MAPBOX_STYLE: string =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ?? 'mapbox://styles/mapbox/light-v11'

export const CENTRO_SANTIAGO = {
  latitude: -33.45,
  longitude: -70.65,
  zoom: 11,
}
