import { Equipment } from "@/types/equipment"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export interface GetEquipmentsOptions {
  limit?: number
  status?: string
  ownerEmail?: string
  search?: string
  name?: string
  location?: string
  category?: string
  rentalType?: string
  minPrice?: number | string
  maxPrice?: number | string
  availability?: string
  sort?: string
}

export const getAllEquipments = async (
  options?: GetEquipmentsOptions
): Promise<Equipment[]> => {
  try {
    const params = new URLSearchParams()

    if (options?.limit) params.append("limit", options.limit.toString())
    if (options?.status) params.append("status", options.status)
    if (options?.ownerEmail) params.append("ownerEmail", options.ownerEmail)
    if (options?.search) params.append("search", options.search)
    if (options?.name) params.append("name", options.name)
    if (options?.location) params.append("location", options.location)
    if (options?.category && options.category !== "All") {
      params.append("category", options.category)
    }
    if (options?.rentalType && options.rentalType !== "All") {
      params.append("rentalType", options.rentalType)
    }
    if (options?.minPrice !== undefined && options.minPrice !== "") {
      params.append("minPrice", options.minPrice.toString())
    }
    if (options?.maxPrice !== undefined && options.maxPrice !== "") {
      params.append("maxPrice", options.maxPrice.toString())
    }
    if (options?.availability && options.availability !== "all") {
      params.append("availability", options.availability)
    }
    if (options?.sort) {
      params.append("sort", options.sort)
    }

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
