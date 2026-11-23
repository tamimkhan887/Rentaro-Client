import { Equipment } from "@/types/equipment"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export interface GetEquipmentsOptions {
  limit?: number
  status?: string
  ownerEmail?: string
}

export const getAllEquipments = async (
  options?: GetEquipmentsOptions
): Promise<Equipment[]> => {
  try {
    const params = new URLSearchParams()
    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.status) params.append("status", options.status)
    if (options?.ownerEmail) params.append("ownerEmail", options.ownerEmail)

    const queryString = params.toString() ? `?${params.toString()}` : ""
    const res = await fetch(`${BASE_URL}/equipments${queryString}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch equipments: ${res.status} ${res.statusText}`)
    }

    const data: Equipment[] = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error in getAllEquipments:", error)
    return []
  }
}