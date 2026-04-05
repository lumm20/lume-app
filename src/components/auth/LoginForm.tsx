"use client"

import { useSearchParams } from "next/navigation"
import { login } from "@/app/(auth)/login/actions"

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Iniciar sesión</h2>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <form action={login} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors mt-2"
        >
          Entrar
        </button>
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
