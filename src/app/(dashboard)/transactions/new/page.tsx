import { TransactionForm } from "@/components/transactions/TransactionForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewTransactionPage() {
  return (
    <div className="max-w-lg">
      {/* Back */}
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Volver a movimientos
      </Link>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Nuevo movimiento</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <TransactionForm />
      </div>
    </div>
  )
}
