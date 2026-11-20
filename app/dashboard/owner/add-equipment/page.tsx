import { PlusCircle } from "lucide-react"

export default function OwnerAddEquipmentPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <PlusCircle className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Add Equipment
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            List a new machine, vehicle, or tool in the Rentora marketplace.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 p-8 text-center backdrop-blur-sm">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Equipment submission form will appear here.
        </p>
      </div>
    </div>
  )
}
