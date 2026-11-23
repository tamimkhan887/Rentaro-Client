"use client"

import { authClient } from "@/lib/auth-client"
import { User, Mail, MapPin, Phone } from "lucide-react"

export default function CustomerProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Customer Profile
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Manage your account information, delivery addresses, and rental preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#e77952]/15 text-[#e77952] font-bold text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {user?.name || "Customer User"}
            </h2>
            <p className="text-xs text-neutral-500">Verified Rental Client</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              <Mail className="size-3.5" />
              <span>Email</span>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {user?.email || "customer@rentora.com"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              <MapPin className="size-3.5" />
              <span>Default Delivery Location</span>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Dhaka, Bangladesh
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
