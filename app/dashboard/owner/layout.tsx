import { requireRole } from "@/lib/unauth"


export default async function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
    await requireRole("owner")
    return children
}