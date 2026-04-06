export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-stone-100 via-rose-50 to-amber-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-stone-200 text-2xl mb-4">
            🍰
          </div>
          <h1 className="text-xl font-semibold text-stone-800">PastryBooks</h1>
          <p className="text-sm text-stone-400 mt-1">Control de finanzas para tu negocio</p>
        </div>
        {children}
      </div>
    </div>
  )
}
