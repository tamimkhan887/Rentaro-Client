import { requireRole } from "@/lib/unauth"

export default async function CustomerDashboardLayout({children}:{children: React.ReactNode}) {
    await requireRole("customer")
    return children;
}