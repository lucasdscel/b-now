// Página /login — Server Component.
// Renderiza LoginForm (Client Component) que gestiona el flujo de magic link.

import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu panel de profesional en bNow.',
}

export default function LoginPage() {
  return <LoginForm />
}
