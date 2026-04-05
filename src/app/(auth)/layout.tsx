export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <span className="text-3xl">🍰</span>
          <h1 className="text-xl font-semibold text-gray-900 mt-2">PastryBooks</h1>
          <p className="text-sm text-gray-500 mt-1">Control de finanzas para tu negocio</p>
        </div>
        {children}
      </div>
    </div>
  )
}
