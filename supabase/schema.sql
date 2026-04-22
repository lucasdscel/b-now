-- ============================================================
-- SCHEMA: Marketplace de profesionales de belleza · Chile
-- Motor: Supabase (PostgreSQL 15+)
-- ============================================================

-- ============================================================
-- FUNCIÓN GENÉRICA: actualizar updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================
-- TABLA: ciudades  (referencia extensible, 1 fila por ciudad)
-- ============================================================
CREATE TABLE IF NOT EXISTS ciudades (
  id         SMALLSERIAL PRIMARY KEY,
  nombre     TEXT        NOT NULL,
  slug       TEXT        NOT NULL UNIQUE,
  region     TEXT        NOT NULL,
  pais       CHAR(2)     NOT NULL DEFAULT 'CL',
  activa     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ciudades (nombre, slug, region) VALUES
  ('Santiago',     'santiago',      'Región Metropolitana'),
  ('Valparaíso',   'valparaiso',    'Región de Valparaíso'),
  ('Concepción',   'concepcion',    'Región del Biobío'),
  ('La Serena',    'la-serena',     'Región de Coquimbo'),
  ('Antofagasta',  'antofagasta',   'Región de Antofagasta'),
  ('Temuco',       'temuco',        'Región de La Araucanía'),
  ('Rancagua',     'rancagua',      'Región del Libertador'),
  ('Puerto Montt', 'puerto-montt',  'Región de Los Lagos')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TABLA: profesionales
-- ============================================================
CREATE TABLE IF NOT EXISTS profesionales (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Vinculado a auth.users; nullable para perfiles creados por admin antes de que el profesional se registre
  user_id         UUID         UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre          TEXT         NOT NULL,
  apellido        TEXT         NOT NULL,
  slug            TEXT         NOT NULL UNIQUE,
  bio             TEXT,
  telefono        TEXT,
  email           TEXT,
  avatar_url      TEXT,
  ciudad_id       SMALLINT     REFERENCES ciudades(id) ON DELETE RESTRICT,
  comuna          TEXT,
  direccion       TEXT,
  lat             NUMERIC(10,7),
  lng             NUMERIC(10,7),
  especialidades  TEXT[]       NOT NULL DEFAULT '{}',    -- ej: '{peluqueria,manicure,maquillaje}'
  instagram_url   TEXT,
  whatsapp        TEXT,
  activo          BOOLEAN      NOT NULL DEFAULT TRUE,
  verificado      BOOLEAN      NOT NULL DEFAULT FALSE,
  plan            TEXT         NOT NULL DEFAULT 'free'
                  CHECK (plan IN ('free', 'pro', 'premium')),
  rating_promedio NUMERIC(3,2)          DEFAULT 0
                  CHECK (rating_promedio BETWEEN 0 AND 5),
  total_reviews   INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profesionales_updated_at
  BEFORE UPDATE ON profesionales
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_prof_ciudad        ON profesionales(ciudad_id);
CREATE INDEX idx_prof_activo        ON profesionales(activo);
CREATE INDEX idx_prof_slug          ON profesionales(slug);
CREATE INDEX idx_prof_user          ON profesionales(user_id);
CREATE INDEX idx_prof_especialidades ON profesionales USING GIN(especialidades);
CREATE INDEX idx_prof_geo           ON profesionales(lat, lng)
  WHERE lat IS NOT NULL AND lng IS NOT NULL;

-- ============================================================
-- TABLA: servicios
-- ============================================================
CREATE TABLE IF NOT EXISTS servicios (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id    UUID        NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  nombre            TEXT        NOT NULL,
  descripcion       TEXT,
  duracion_minutos  INT         NOT NULL DEFAULT 60
                    CHECK (duracion_minutos > 0),
  precio            INT         CHECK (precio >= 0),        -- precio fijo CLP
  precio_desde      INT         CHECK (precio_desde >= 0),  -- precio "desde" CLP
  activo            BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_servicios_updated_at
  BEFORE UPDATE ON servicios
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_svc_profesional ON servicios(profesional_id);
CREATE INDEX idx_svc_activo      ON servicios(profesional_id, activo);

-- ============================================================
-- TABLA: fotos  (portafolio / galería)
-- ============================================================
CREATE TABLE IF NOT EXISTS fotos (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id UUID        NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  url            TEXT        NOT NULL,
  descripcion    TEXT,
  es_portada     BOOLEAN     NOT NULL DEFAULT FALSE,
  orden          SMALLINT    NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fotos_profesional ON fotos(profesional_id);
CREATE INDEX idx_fotos_portada     ON fotos(profesional_id, es_portada);

-- ============================================================
-- TABLA: disponibilidad_slots
-- (horarios recurrentes por día de la semana)
-- ============================================================
CREATE TABLE IF NOT EXISTS disponibilidad_slots (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id UUID        NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  dia_semana     SMALLINT    NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),  -- 0=Lun … 6=Dom
  hora_inicio    TIME        NOT NULL,
  hora_fin       TIME        NOT NULL,
  activo         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_slot_horas CHECK (hora_fin > hora_inicio)
);

CREATE TRIGGER trg_slots_updated_at
  BEFORE UPDATE ON disponibilidad_slots
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_slots_profesional ON disponibilidad_slots(profesional_id, activo);
CREATE INDEX idx_slots_dia         ON disponibilidad_slots(dia_semana);

-- ============================================================
-- TABLA: reservas
-- ============================================================
CREATE TYPE estado_reserva AS ENUM (
  'pendiente', 'confirmada', 'cancelada', 'completada', 'no_show'
);

CREATE TABLE IF NOT EXISTS reservas (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id   UUID           NOT NULL REFERENCES profesionales(id) ON DELETE RESTRICT,
  servicio_id      UUID           REFERENCES servicios(id) ON DELETE SET NULL,
  cliente_user_id  UUID           REFERENCES auth.users(id) ON DELETE SET NULL,
  cliente_nombre   TEXT           NOT NULL,
  cliente_email    TEXT,
  cliente_telefono TEXT,
  fecha            DATE           NOT NULL,
  hora_inicio      TIME           NOT NULL,
  hora_fin         TIME           NOT NULL,
  estado           estado_reserva NOT NULL DEFAULT 'pendiente',
  notas            TEXT,
  precio_acordado  INT            CHECK (precio_acordado >= 0),
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_reserva_horas CHECK (hora_fin > hora_inicio)
);

CREATE TRIGGER trg_reservas_updated_at
  BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_res_profesional ON reservas(profesional_id);
CREATE INDEX idx_res_fecha       ON reservas(profesional_id, fecha);
CREATE INDEX idx_res_estado      ON reservas(estado);
CREATE INDEX idx_res_cliente     ON reservas(cliente_user_id);

-- ============================================================
-- TABLA: contact_events
-- (analítica de conversiones: clicks en WhatsApp, teléfono, etc.)
-- ============================================================
CREATE TYPE tipo_contacto AS ENUM (
  'whatsapp', 'telefono', 'instagram', 'formulario', 'ver_mapa'
);

CREATE TABLE IF NOT EXISTS contact_events (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id   UUID          NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  tipo             tipo_contacto NOT NULL,
  cliente_user_id  UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  ciudad_id        SMALLINT      REFERENCES ciudades(id) ON DELETE SET NULL,
  ip_hash          TEXT,         -- SHA-256 del IP anonimizado
  referrer         TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_profesional ON contact_events(profesional_id);
CREATE INDEX idx_contact_fecha       ON contact_events(profesional_id, created_at);
CREATE INDEX idx_contact_tipo        ON contact_events(tipo);

-- ============================================================
-- TABLA: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profesional_id        UUID        NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
  -- UNIQUE garantiza 1 review por reserva a nivel de base de datos
  reserva_id            UUID        UNIQUE REFERENCES reservas(id) ON DELETE SET NULL,
  cliente_user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  cliente_nombre        TEXT,
  puntuacion            SMALLINT    NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario            TEXT,
  respuesta_profesional TEXT,
  publicada             BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_reviews_profesional ON reviews(profesional_id, publicada);
CREATE INDEX idx_reviews_cliente     ON reviews(cliente_user_id);

-- ============================================================
-- TRIGGER: recalcular rating_promedio y total_reviews
-- (se ejecuta tras INSERT / UPDATE / DELETE en reviews)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_recalcular_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_pid UUID := COALESCE(NEW.profesional_id, OLD.profesional_id);
BEGIN
  UPDATE profesionales
  SET
    rating_promedio = (
      SELECT ROUND(AVG(puntuacion)::NUMERIC, 2)
      FROM   reviews
      WHERE  profesional_id = v_pid AND publicada = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM   reviews
      WHERE  profesional_id = v_pid AND publicada = TRUE
    )
  WHERE id = v_pid;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_reviews_rating
  AFTER INSERT OR UPDATE OF puntuacion, publicada OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION fn_recalcular_rating();

-- ============================================================
-- RLS: habilitar en todas las tablas
-- ============================================================
ALTER TABLE ciudades              ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales         ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios             ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidad_slots  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews               ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES · ciudades
-- ============================================================
CREATE POLICY "ciudades: lectura pública de activas"
  ON ciudades FOR SELECT
  USING (activa = TRUE);

-- ============================================================
-- RLS POLICIES · profesionales
-- ============================================================
-- Cualquiera puede ver perfiles activos
CREATE POLICY "profesionales: lectura pública de activos"
  ON profesionales FOR SELECT
  USING (activo = TRUE);

-- El dueño puede ver su propio perfil aunque esté inactivo
CREATE POLICY "profesionales: dueño ve el suyo"
  ON profesionales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profesionales: dueño actualiza el suyo"
  ON profesionales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "profesionales: inserción propia"
  ON profesionales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES · servicios
-- ============================================================
CREATE POLICY "servicios: lectura pública de activos"
  ON servicios FOR SELECT
  USING (
    activo = TRUE
    AND EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.activo = TRUE
    )
  );

-- El dueño gestiona todos los servicios (activos e inactivos)
CREATE POLICY "servicios: CRUD del dueño"
  ON servicios FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES · fotos
-- ============================================================
CREATE POLICY "fotos: lectura pública"
  ON fotos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.activo = TRUE
    )
  );

CREATE POLICY "fotos: CRUD del dueño"
  ON fotos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES · disponibilidad_slots
-- ============================================================
CREATE POLICY "slots: lectura pública de activos"
  ON disponibilidad_slots FOR SELECT
  USING (activo = TRUE);

CREATE POLICY "slots: CRUD del dueño"
  ON disponibilidad_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES · reservas
-- ============================================================
-- El profesional ve todas sus reservas
CREATE POLICY "reservas: profesional ve las suyas"
  ON reservas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- El cliente ve sus propias reservas
CREATE POLICY "reservas: cliente ve las suyas"
  ON reservas FOR SELECT
  USING (auth.uid() = cliente_user_id);

-- Cualquiera puede crear una reserva (usuarios anónimos incluidos)
CREATE POLICY "reservas: inserción abierta"
  ON reservas FOR INSERT
  WITH CHECK (TRUE);

-- El profesional puede cambiar el estado de sus reservas
CREATE POLICY "reservas: profesional actualiza estado"
  ON reservas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- El cliente puede cancelar solo si la reserva está pendiente
CREATE POLICY "reservas: cliente cancela pendiente"
  ON reservas FOR UPDATE
  USING (auth.uid() = cliente_user_id AND estado = 'pendiente');

-- ============================================================
-- RLS POLICIES · contact_events
-- ============================================================
-- Inserción abierta (se hace al hacer click en whatsapp, etc.)
CREATE POLICY "contact_events: inserción abierta"
  ON contact_events FOR INSERT
  WITH CHECK (TRUE);

-- Solo el profesional puede ver sus propios eventos
CREATE POLICY "contact_events: profesional ve los suyos"
  ON contact_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES · reviews
-- ============================================================
CREATE POLICY "reviews: lectura pública de publicadas"
  ON reviews FOR SELECT
  USING (publicada = TRUE);

-- El profesional ve todas sus reviews (incluso no publicadas)
CREATE POLICY "reviews: profesional ve las suyas"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );

-- Solo usuarios autenticados pueden publicar una review
-- (el UNIQUE en reserva_id previene duplicados a nivel de BD)
CREATE POLICY "reviews: cliente autenticado inserta"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = cliente_user_id);

-- El profesional puede escribir o editar su respuesta
CREATE POLICY "reviews: profesional responde"
  ON reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profesionales p
      WHERE p.id = profesional_id AND p.user_id = auth.uid()
    )
  );
