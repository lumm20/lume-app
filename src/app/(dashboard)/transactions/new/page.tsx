import { TransactionForm } from "@/components/transactions/TransactionForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewTransactionPage() {
  return (
    <div className="max-w-lg">
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Volver a movimientos
      </Link>

      <h1 className="text-xl font-semibold text-stone-800 mb-6">Nuevo movimiento</h1>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <TransactionForm />
      </div>
    </div>
  )
}
