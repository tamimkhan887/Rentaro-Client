"use client"

import { authClient } from "@/lib/auth-client"
import { ShieldCheck, Mail, User, KeyRound } from "lucide-react"

export default function AdminMyProfilePage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Administrator Profile
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Manage your administrative credentials, security keys, and notifications.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 font-bold text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {user?.name || "Administrator"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                <ShieldCheck className="size-3" />
                <span>Super Administrator</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              <Mail className="size-3.5" />
              <span>Email Address</span>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {user?.email || "admin@rentora.com"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              <KeyRound className="size-3.5" />
              <span>Security Level</span>
            </div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 font-semibold">
              Full Platform Access (Level 1)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
