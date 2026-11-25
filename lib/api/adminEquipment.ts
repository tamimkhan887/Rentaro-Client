import { Equipment } from "@/types/equipment"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

function getAuthHeaders(): HeadersInit {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access-token")
    if (token) return { authorization: `Bearer ${token}` }
  }
  return {}
}

export interface AdminEquipmentQueryOptions {
  search?: string
  status?: string
  category?: string
}

/**
 * Fetch all equipment for admin management (Pending, Approved, Rejected)
 */
export async function getAllAdminEquipments(
  options?: AdminEquipmentQueryOptions
): Promise<Equipment[]> {
  try {
    const params = new URLSearchParams()

    if (options?.search && options.search.trim()) {
      params.append("search", options.search.trim())
    }
    if (options?.status && options.status !== "all" && options.status !== "All") {
      params.append("status", options.status)
    }
    if (options?.category && options.category !== "All") {
      params.append("category", options.category)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""
    const res = await fetch(`${BASE_URL}/equipments${queryString}`, {
      cache: "no-store",
      headers: getAuthHeaders(),
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch equipments: ${res.statusText}`)
    }

    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Error in getAllAdminEquipments:", err)
    return []
  }
}

/**
 * Update equipment status (Pending, Approved, Rejected)
 */
export async function updateEquipmentStatus(
  id: string,
  status: "Pending" | "Approved" | "Rejected" | string
): Promise<{ success: boolean; modifiedCount?: number; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/equipments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update equipment status" }
    }
    return data
  } catch (err) {
    console.error("Error in updateEquipmentStatus:", err)
    return { success: false, error: "Network error updating status" }
  }
}

/**
 * Update full equipment details
 */
export async function updateEquipmentDetails(
  id: string,
  data: Partial<Equipment>
): Promise<{ success: boolean; modifiedCount?: number; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/equipments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    if (!res.ok) {
      return { success: false, error: result.error || "Failed to update equipment" }
    }
    return result
  } catch (err) {
    console.error("Error in updateEquipmentDetails:", err)
    return { success: false, error: "Network error updating equipment" }
  }
}

/**
 * Delete an equipment item
 */
export async function deleteEquipmentItem(
  id: string
): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/equipments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to delete equipment" }
    }
    return data
  } catch (err) {
    console.error("Error in deleteEquipmentItem:", err)
    return { success: false, error: "Network error deleting equipment" }
  }
}
