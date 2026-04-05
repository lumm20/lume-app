"use client"

import { useSearchParams } from "next/navigation"
import { login } from "@/app/(auth)/login/actions"
import { SubmitButton } from "../ui/SubmitButton"

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
      <h2 className="text-base font-semibold text-stone-800 mb-6">Iniciar sesión</h2>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600">
          {error}
        </div>
      )}

      <form action={login} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-stone-600">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-stone-600">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 focus:bg-white transition-colors"
          />
        </div>

        <SubmitButton initialText="Entrar" loadingText="Iniciando sesión..." className="w-full rounded-xl bg-stone-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 transition-colors mt-2 flex items-center justify-center gap-2"/>
      </form>

      {/*
        * MULTI-USUARIO: cuando quieras permitir registro,
        * descomenta este bloque y crea /register
        *
        * <p className="text-center text-sm text-gray-500 mt-4">
        *   ¿No tienes cuenta?{" "}
        *   <a href="/register" className="text-emerald-600 hover:underline font-medium">
        *     Regístrate
        *   </a>
        * </p>
      */}
    </div>
  )
}
