import { requireRole } from "@/lib/unauth";


export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    await requireRole("admin")
    return children
}