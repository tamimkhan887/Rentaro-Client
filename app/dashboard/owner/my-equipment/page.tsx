import Link from "next/link"
import { Boxes, PlusCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OwnerMyEquipmentPage() {
  const fleet = [
    {
      id: "FLEET-01",
      name: "CAT 320 Hydraulic Excavator",
      rate: "$350 / day",
      location: "Dhaka Central Yard",
      status: "Available for Rent",
    },
    {
      id: "FLEET-02",
      name: "Komatsu D65 Crawler Dozer",
      rate: "$420 / day",
      location: "Chittagong Depot",
      status: "Currently Rented",
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            My Equipment Fleet
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage your machinery inventory, update daily rental rates, and track availability.
          </p>
        </div>

        <Link href="/dashboard/owner/add-equipment">
          <Button variant="brand" size="sm" className="gap-2 cursor-pointer">
            <PlusCircle className="size-4" />
            <span>Add Equipment</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fleet.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">{item.id}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="size-3" />
                <span>{item.status}</span>
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{item.name}</h2>
              <p className="text-xs text-neutral-500 mt-0.5">{item.location}</p>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-sm font-bold text-[#e77952]">{item.rate}</span>
              <Button variant="outline" size="xs">
                Edit Machine
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
