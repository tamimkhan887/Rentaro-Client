import { Truck, CheckCircle2 } from "lucide-react"

export default function OwnerMyEquipmentRentalPage() {
  const rentalOrders = [
    {
      id: "ORD-9021",
      machine: "Komatsu D65 Crawler Dozer",
      customer: "Sarah Jenkins (BuildCorp)",
      period: "Nov 15 - Nov 25, 2026",
      payout: "$4,200",
      status: "Active Lease",
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          My Equipment Rentals
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Customer bookings, active field dispatches, lease periods, and earnings.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850/50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Booking #</th>
                <th className="py-3.5 px-4 sm:px-6">Machinery</th>
                <th className="py-3.5 px-4 sm:px-6">Customer</th>
                <th className="py-3.5 px-4 sm:px-6">Rental Duration</th>
                <th className="py-3.5 px-4 sm:px-6">Total Payout</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {rentalOrders.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40">
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-neutral-600 dark:text-neutral-300">
                    {o.id}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-neutral-900 dark:text-neutral-100">
                    {o.machine}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-neutral-600 dark:text-neutral-300">
                    {o.customer}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-neutral-500">
                    {o.period}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">
                    {o.payout}
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="size-3.5" />
                      <span>{o.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
