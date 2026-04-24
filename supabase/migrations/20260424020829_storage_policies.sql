-- Políticas de Storage para el bucket 'fotos-profesionales'.
-- Path esperado: {profesional_id}/{timestamp}-{random}.webp
-- El bucket debe estar marcado como público para que SELECT funcione sin auth.

-- INSERT: solo el dueño del profesional puede subir a su carpeta
CREATE POLICY "Profesionales suben sus propias fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'fotos-profesionales'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM profesionales WHERE user_id = auth.uid()
    )
  );

-- UPDATE: mismo criterio
CREATE POLICY "Profesionales actualizan sus propias fotos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'fotos-profesionales'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM profesionales WHERE user_id = auth.uid()
    )
  );

-- DELETE: mismo criterio
CREATE POLICY "Profesionales eliminan sus propias fotos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'fotos-profesionales'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM profesionales WHERE user_id = auth.uid()
    )
  );

-- SELECT: lectura pública (explícito aunque el bucket ya sea público)
CREATE POLICY "Lectura pública de fotos de profesionales"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'fotos-profesionales');
