import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

export function SubmitButton({initialText, loadingText, className}:{initialText:string, loadingText:string, className:string}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}>
      {pending && <Loader2 size={15} className="animate-spin" />}
      {pending ? loadingText : initialText}
    </button>
  )
}
