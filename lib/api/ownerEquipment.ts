"use server"

import { Equipment } from "@/types/equipment"
import { authFetch } from "../unauth"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export async function getOwnerEquipments(ownerEmail: string): Promise<Equipment[]> {
  try {
    const res = await authFetch(`${BASE_URL}/equipments?ownerEmail=${encodeURIComponent(ownerEmail)}`) 
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Error in getOwnerEquipments:", err)
    return []
  }
}

export async function deleteEquipment(id: string): Promise<{ success: boolean; deletedCount?: number }> {
  try {
    const res = await authFetch(`${BASE_URL}/equipments/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      return { success: false }
    }
    return await res.json()
  } catch (err) {
    console.error("Error in deleteEquipment:", err)
    return { success: false }
  }
}

export async function updateEquipment(
  id: string,
  data: Partial<Equipment>
): Promise<{ success: boolean; modifiedCount?: number; error?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/equipments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.error || "Failed to update equipment" }
    }
    return await res.json()
  } catch (err) {
    console.error("Error in updateEquipment:", err)
    return { success: false, error: "Network error while updating equipment" }
  }
}
