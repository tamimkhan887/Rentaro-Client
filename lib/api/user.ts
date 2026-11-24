export interface UserItem {
  _id?: string
  id?: string
  name: string
  email: string
  emailVerified?: boolean
  image?: string | null
  role?: "customer" | "owner" | "admin" | "Customer" | "Owner" | "Admin" | string
  createdAt?: string
  updatedAt?: string
  status?: string
}

export interface GetUsersOptions {
  search?: string
  role?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

/**
 * Fetch all users with optional search (name/email) and role filtering
 */
export async function getAllUsers(options?: GetUsersOptions): Promise<UserItem[]> {
  try {
    const params = new URLSearchParams()
    if (options?.search && options.search.trim()) {
      params.append("search", options.search.trim())
    }
    if (options?.role && options.role !== "all" && options.role !== "All") {
      params.append("role", options.role)
    }

    const queryString = params.toString() ? `?${params.toString()}` : ""
    const res = await fetch(`${BASE_URL}/users${queryString}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`)
    }

    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Error in getAllUsers:", err)
    return []
  }
}

/**
 * Fetch a single user by ID
 */
export async function getUserById(id: string): Promise<UserItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error("Error in getUserById:", err)
    return null
  }
}

/**
 * Change user role (Customer, Owner, Admin)
 */
export async function updateUserRole(
  userId: string,
  role: string
): Promise<{ success: boolean; modifiedCount?: number; role?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to update role" }
    }
    return data
  } catch (err) {
    console.error("Error in updateUserRole:", err)
    return { success: false, error: "Network error updating user role" }
  }
}

/**
 * Update user details (name, email, role, etc.)
 */
export async function updateUser(
  userId: string,
  data: Partial<UserItem>
): Promise<{ success: boolean; modifiedCount?: number; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    if (!res.ok) {
      return { success: false, error: result.error || "Failed to update user" }
    }
    return result
  } catch (err) {
    console.error("Error in updateUser:", err)
    return { success: false, error: "Network error updating user" }
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(
  userId: string
): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to delete user" }
    }
    return data
  } catch (err) {
    console.error("Error in deleteUser:", err)
    return { success: false, error: "Network error deleting user" }
  }
}
