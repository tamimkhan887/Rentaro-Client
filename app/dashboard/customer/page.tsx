import Link from "next/link"
import {
  UserCheck,
  ShoppingBag,
  Heart,
  User,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CustomerDashboardPage() {
  const routes = [
    {
      title: "My Rentals",
      href: "/dashboard/customer/my-rentals",
      description: "Review your active machinery leases, rental contracts, schedules, and booking requests.",
      icon: ShoppingBag,
      badge: "Bookings",
    },
    {
      title: "Favorites",
      href: "/dashboard/customer/favorites",
      description: "Quick access to your saved and shortlisted equipment, machinery, and vehicles.",
      icon: Heart,
      badge: "Saved Fleet",
    },
    {
      title: "Profile",
      href: "/dashboard/customer/profile",
      description: "Manage your personal profile information, delivery addresses, and account preferences.",
      icon: User,
      badge: "Customer Account",
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Welcome to Your Customer Dashboard
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Manage your equipment bookings, view shortlisted machinery in your favorites, and update your rental profile.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/equipment">
              <Button size="sm" className="gap-2">
                <Layers className="h-4 w-4" />
                <span>Explore All Equipment</span>
              </Button>
            </Link>
            <Link href="/dashboard/customer/favorites">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span>View Saved Favorites</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((route) => {
          const Icon = route.icon
          return (
            <Link
              key={route.href}
              href={route.href}
              className="group p-6 rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {route.badge}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {route.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {route.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 border-t border-border/60">
                <span>Go to {route.title}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
