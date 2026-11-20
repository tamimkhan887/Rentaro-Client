import { Users } from "lucide-react"

export default function AdminAllUsersPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <Users className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            All Users
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Manage user accounts, roles (Customer, Owner, Admin), and account statuses.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 p-8 text-center backdrop-blur-sm">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          User management table and moderation controls will appear here.
        </p>
      </div>
    </div>
  )
}
