import { createClient } from "@/lib/supabase/server"
import { TransactionForm } from "@/components/transactions/TransactionForm"
import { updateTransaction } from "@/app/(dashboard)/transactions/actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditTransactionPage({
  params,
}: {
  params:Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params;
  const { data: movimiento } = await supabase
    .from("movimientos")
    .select("*")
    .eq("id", id)
    .single()

  if (!movimiento) notFound()

  return (
    <div className="max-w-lg">
      <Link
        href="/movimientos"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Volver a movimientos
      </Link>
      <h1 className="text-xl font-semibold text-stone-800 mb-6">Editar movimiento</h1>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <TransactionForm
          onSubmit={updateTransaction.bind(null, id)}
          defaultValues={movimiento}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  )
}