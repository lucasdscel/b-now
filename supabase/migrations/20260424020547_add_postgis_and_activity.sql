-- Habilitar PostGIS (idempotente)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Agregar columna last_active_at en profesionales
ALTER TABLE profesionales
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Índice para queries ordenadas por actividad reciente
CREATE INDEX IF NOT EXISTS idx_prof_last_active
  ON profesionales(last_active_at DESC NULLS LAST);

-- Columna generada 'geom' de tipo geography derivada de lat/lng
-- STORED porque GENERATED VIRTUAL no soporta geography en PostgreSQL
ALTER TABLE profesionales
  ADD COLUMN IF NOT EXISTS geom geography(POINT, 4326)
    GENERATED ALWAYS AS (
      CASE
        WHEN lat IS NOT NULL AND lng IS NOT NULL
        THEN ST_SetSRID(ST_MakePoint(lng::float, lat::float), 4326)::geography
        ELSE NULL
      END
    ) STORED;

-- Índice geográfico GIST para queries espaciales eficientes
CREATE INDEX IF NOT EXISTS idx_prof_geom
  ON profesionales USING GIST(geom)
  WHERE geom IS NOT NULL;

-- Función para actualizar last_active_at desde el backend
CREATE OR REPLACE FUNCTION update_last_active(profesional_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profesionales
  SET last_active_at = NOW()
  WHERE id = profesional_uuid;
END;
$$;

-- Función para queries "cerca de mí" usando PostGIS
-- Retorna profesionales activos dentro de max_km_radius, ordenados por distancia
CREATE OR REPLACE FUNCTION nearest_profesionales(
  user_lat  DOUBLE PRECISION,
  user_lng  DOUBLE PRECISION,
  max_km_radius DOUBLE PRECISION DEFAULT 5,
  limit_n   INT DEFAULT 20
)
RETURNS TABLE (
  id             UUID,
  nombre         TEXT,
  apellido       TEXT,
  slug           TEXT,
  lat            NUMERIC,
  lng            NUMERIC,
  distancia_km   DOUBLE PRECISION,
  last_active_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.nombre,
    p.apellido,
    p.slug,
    p.lat,
    p.lng,
    ST_Distance(
      p.geom,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000 AS distancia_km,
    p.last_active_at
  FROM profesionales p
  WHERE p.activo = TRUE
    AND p.geom IS NOT NULL
    AND ST_DWithin(
      p.geom,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      max_km_radius * 1000
    )
  ORDER BY p.geom <-> ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
  LIMIT limit_n;
$$;
