// lib/supabase/server.ts
// Usar este cliente en Server Components y Server Actions
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
           cookiesToSet.forEach(async({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // En Server Components no se pueden setear cookies.
            // El middleware se encarga del refresh de sesión.
          }
        },
      },
    }
  )
}
