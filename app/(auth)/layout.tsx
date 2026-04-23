// Layout mínimo para rutas de autenticación (/login, etc.)
// Sin sidebar ni header del dashboard — solo centra el contenido.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">bNow</h1>
          <p className="text-sm text-muted-foreground">Acceso para profesionales</p>
        </div>
        {children}
      </div>
    </div>
  )
}
