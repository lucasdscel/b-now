'use client'
// Formulario de magic link para profesionales.
// Client component — maneja estado local y llama signInWithOtp desde el browser.

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      setState('error')
      setErrorMsg(error.message)
    } else {
      setState('success')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center space-y-2">
        <p className="text-base font-semibold">¡Revisa tu correo!</p>
        <p className="text-sm text-muted-foreground">
          Te enviamos un link de acceso a{' '}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
        <p className="text-xs text-muted-foreground pt-1">
          El link expira en 1 hora. Revisa también tu carpeta de spam.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tuemail@ejemplo.com"
          disabled={state === 'loading'}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm
                     placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-[#D4537E] focus:ring-offset-1
                     disabled:cursor-not-allowed disabled:opacity-50
                     transition-shadow"
        />
      </div>

      {state === 'error' && (
        <p className="text-sm text-destructive" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white
                   bg-[#D4537E] hover:bg-[#bf4570] active:bg-[#a83960]
                   disabled:cursor-not-allowed disabled:opacity-50
                   transition-colors"
      >
        {state === 'loading' ? 'Enviando...' : 'Enviar link de acceso'}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Te enviaremos un link mágico — sin contraseña necesaria.
      </p>
    </form>
  )
}
