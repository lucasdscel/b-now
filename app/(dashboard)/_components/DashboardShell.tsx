'use client'
// Shell visual del dashboard — header, sidebar desktop, drawer mobile.
// Client Component: necesita usePathname() para el link activo y useState para el drawer.

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Scissors,
  Camera,
  Calendar,
  CalendarCheck,
  BarChart3,
  Menu,
  ChevronDown,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { ProfesionalActual } from '@/lib/auth/get-profesional'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { href: '/dashboard/perfil', label: 'Mi perfil', icon: User },
  { href: '/dashboard/servicios', label: 'Servicios', icon: Scissors },
  { href: '/dashboard/fotos', label: 'Fotos', icon: Camera },
  { href: '/dashboard/disponibilidad', label: 'Disponibilidad', icon: Calendar },
  { href: '/dashboard/reservas', label: 'Reservas', icon: CalendarCheck },
  { href: '/dashboard/estadisticas', label: 'Estadísticas', icon: BarChart3 },
] as const

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navegación principal" className="space-y-0.5 px-3">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[#FBEAF0] text-[#D4537E]'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ].join(' ')}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

interface Props {
  profesional: ProfesionalActual
  userEmail: string
  children: React.ReactNode
}

export default function DashboardShell({ profesional, userEmail, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const initial = profesional.nombre.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 sm:px-6">
        {/* Mobile drawer trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <div className="px-5 py-4 border-b">
              <span className="text-base font-bold">BeautyNow</span>
            </div>
            <div className="py-4">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo desktop */}
        <Link href="/dashboard" className="hidden sm:block text-base font-bold">
          BeautyNow
        </Link>

        <div className="flex-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full px-2 py-1 text-sm hover:bg-muted transition-colors"
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <div
              className="h-7 w-7 rounded-full bg-[#D4537E] flex items-center justify-center
                         text-white text-xs font-bold shrink-0"
              aria-hidden
            >
              {initial}
            </div>
            <span className="hidden sm:block max-w-[150px] truncate text-sm text-muted-foreground">
              {userEmail}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </button>

          {userMenuOpen && (
            <>
              {/* Backdrop para cerrar al clickear afuera */}
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border bg-popover shadow-md py-1">
                <div className="px-3 py-2 border-b mb-1">
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  <p className="text-sm font-medium truncate">
                    {profesional.nombre} {profesional.apellido}
                  </p>
                </div>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-md mx-1 px-3 py-2 text-sm
                               text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Cerrar sesión
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex">
        {/* Sidebar desktop */}
        <aside className="hidden sm:flex w-56 shrink-0 flex-col border-r min-h-[calc(100vh-3.5rem)] py-4 bg-background">
          <NavLinks />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
