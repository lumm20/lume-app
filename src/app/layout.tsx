import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LumeApp",
  description: "Control de finanzas para Lume Bakery",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-stone-100 text-stone-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}