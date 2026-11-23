import Link from "next/link"
import {
  UserCheck,
  ShoppingBag,
  Heart,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function CustomerDashboardPage() {
  const routes = [
    {
      title: "My Rentals",
      href: "/dashboard/customer/my-rentals",
      description: "Review your active machinery leases, rental contracts, schedules, and billing invoices.",
      icon: ShoppingBag,
      badge: "Bookings",
    },
    {
      title: "Favorites",
      href: "/dashboard/customer/favorites",
      description: "Quick access to your saved and shortlisted equipment, excavators, and vehicles.",
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
    <div>

    </div>
  )
}
