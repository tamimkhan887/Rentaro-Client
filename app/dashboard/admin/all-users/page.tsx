"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  User,
  ShieldCheck,
  HardHat,
  UserCheck,
  Search,
  Mail,
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Filter,
  X,
  MoreVertical,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  RefreshCw,
} from "lucide-react"

import { UserItem, getAllUsers, updateUserRole, updateUser, deleteUser } from "@/lib/api/user"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Role styling and descriptions
const ROLES = [
  {
    value: "customer",
    label: "Customer",
    icon: User,
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Standard customer access: browse equipment, place bookings, save favorites.",
  },
  {
    value: "owner",
    label: "Owner",
    icon: HardHat,
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Equipment partner: can add machinery, manage fleet, and review rental requests.",
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Platform administrator: full access to approve listings, manage users, and system controls.",
  },
] as const

export default function AdminAllUsersPage() {
  const { data: session } = authClient.useSession()
  const currentUser = session?.user

  const [users, setUsers] = React.useState<UserItem[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedRoleFilter, setSelectedRoleFilter] = React.useState<string>("all")

  // Change Role Modal State
  const [userForRoleChange, setUserForRoleChange] = React.useState<UserItem | null>(null)
  const [targetRole, setTargetRole] = React.useState<string>("customer")
  const [isUpdatingRole, setIsUpdatingRole] = React.useState<boolean>(false)

  // Manage / Edit User Modal State
  const [userToManage, setUserToManage] = React.useState<UserItem | null>(null)
  const [manageName, setManageName] = React.useState<string>("")
  const [manageRole, setManageRole] = React.useState<string>("customer")
  const [isSavingUser, setIsSavingUser] = React.useState<boolean>(false)

  // Delete User Modal State
  const [userToDelete, setUserToDelete] = React.useState<UserItem | null>(null)
  const [isDeletingUser, setIsDeletingUser] = React.useState<boolean>(false)

  // Fetch all users
  const fetchUsers = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAllUsers({
        search: searchQuery,
        role: selectedRoleFilter,
      })
      setUsers(data || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      toast.add({
        title: "Error Loading Users",
        description: "Could not fetch platform users. Please refresh the page.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedRoleFilter])

  // Trigger search with small debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 250)
    return () => clearTimeout(timer)
  }, [fetchUsers])

  // Handle open Role Modal
  const handleOpenRoleModal = (user: UserItem) => {
    setUserForRoleChange(user)
    setTargetRole((user.role || "customer").toLowerCase())
  }

  // Handle Submit Role Change
  const handleConfirmRoleChange = async () => {
    if (!userForRoleChange) return
    const id = userForRoleChange._id || userForRoleChange.id
    if (!id) return

    setIsUpdatingRole(true)
    try {
      const res = await updateUserRole(id, targetRole)
      if (res.success) {
        toast.add({
          title: "Role Updated Successfully",
          description: `${userForRoleChange.name}'s role was updated to ${targetRole.toUpperCase()}.`,
          type: "success",
        })

        // Optimistically update list
        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === id ? { ...u, role: targetRole } : u
          )
        )
        setUserForRoleChange(null)
      } else {
        toast.add({
          title: "Role Update Failed",
          description: res.error || "Could not update user role.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Failed to update role:", err)
      toast.add({
        title: "Error",
        description: "An unexpected error occurred while updating role.",
        type: "error",
      })
    } finally {
      setIsUpdatingRole(false)
    }
  }

  // Handle open Manage User Modal
  const handleOpenManageModal = (user: UserItem) => {
    setUserToManage(user)
    setManageName(user.name || "")
    setManageRole((user.role || "customer").toLowerCase())
  }

  // Handle Save User in Manage Modal
  const handleSaveManageUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userToManage) return
    const id = userToManage._id || userToManage.id
    if (!id) return

    setIsSavingUser(true)
    try {
      const res = await updateUser(id, {
        name: manageName,
        role: manageRole,
      })

      if (res.success) {
        toast.add({
          title: "User Profile Updated",
          description: `Updated details for ${manageName}.`,
          type: "success",
        })

        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === id ? { ...u, name: manageName, role: manageRole } : u
          )
        )
        setUserToManage(null)
      } else {
        toast.add({
          title: "Update Failed",
          description: res.error || "Could not update user.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Failed to update user:", err)
      toast.add({
        title: "Error",
        description: "An unexpected error occurred.",
        type: "error",
      })
    } finally {
      setIsSavingUser(false)
    }
  }

  // Handle Confirm Delete User
  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return
    const id = userToDelete._id || userToDelete.id
    if (!id) return

    // Prevent deleting oneself
    if (currentUser?.email && userToDelete.email === currentUser.email) {
      toast.add({
        title: "Action Not Allowed",
        description: "You cannot delete your own active administrator account.",
        type: "error",
      })
      setUserToDelete(null)
      return
    }

    setIsDeletingUser(true)
    try {
      const res = await deleteUser(id)
      if (res.success) {
        toast.add({
          title: "User Deleted",
          description: `Account for ${userToDelete.name} has been removed.`,
          type: "info",
        })

        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id))
        setUserToDelete(null)
      } else {
        toast.add({
          title: "Deletion Failed",
          description: res.error || "Could not delete user account.",
          type: "error",
        })
      }
    } catch (err) {
      console.error("Failed to delete user:", err)
      toast.add({
        title: "Error",
        description: "An unexpected error occurred while deleting user.",
        type: "error",
      })
    } finally {
      setIsDeletingUser(false)
    }
  }

  // Metrics
  const totalCount = users.length
  const customerCount = users.filter((u) => (u.role || "customer").toLowerCase() === "customer").length
  const ownerCount = users.filter((u) => (u.role || "").toLowerCase() === "owner").length
  const adminCount = users.filter((u) => (u.role || "").toLowerCase() === "admin").length

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              User Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {totalCount} {totalCount === 1 ? "user" : "users"}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            View all platform members, update account access roles (Customer, Owner, Admin), and manage credentials.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={isLoading}
          className="gap-2 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Users</span>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{totalCount}</h3>
            </div>
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">All registered accounts</p>
        </Card>

        <Card className="p-4 sm:p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Customers</p>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {customerCount}
              </h3>
            </div>
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Renters & equipment clients</p>
        </Card>

        <Card className="p-4 sm:p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Equipment Owners</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {ownerCount}
              </h3>
            </div>
            <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HardHat className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Fleet suppliers & partners</p>
        </Card>

        <Card className="p-4 sm:p-5 border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Administrators</p>
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {adminCount}
              </h3>
            </div>
            <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">System operators with full privileges</p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
            Role:
          </span>
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            {["all", "customer", "owner", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedRoleFilter === r
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-border/70 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Fetching platform users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground p-4 space-y-3">
            <Users className="size-10 mx-auto text-muted-foreground/60 stroke-[1.5]" />
            <h3 className="text-base font-semibold text-foreground">No Users Found</h3>
            <p className="text-xs sm:text-sm max-w-md mx-auto">
              No users match your search query &ldquo;{searchQuery}&rdquo; or selected role filter.
            </p>
            {(searchQuery || selectedRoleFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedRoleFilter("all")
                }}
                className="text-xs"
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Member Since</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((userItem) => {
                  const id = userItem._id || userItem.id || ""
                  const roleLower = (userItem.role || "customer").toLowerCase()
                  const roleObj =
                    ROLES.find((r) => r.value === roleLower) || ROLES[0]
                  const RoleIcon = roleObj.icon

                  // Format created date
                  const joinedDate = userItem.createdAt
                    ? new Date(userItem.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently"

                  const isCurrentUser = Boolean(
                    currentUser?.email && userItem.email === currentUser.email
                  )

                  return (
                    <tr
                      key={id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* 1. User Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 sm:size-11 shrink-0 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                            {userItem.image ? (
                              <Image
                                src={userItem.image}
                                alt={userItem.name || "User"}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <span>
                                {userItem.name
                                  ? userItem.name.charAt(0).toUpperCase()
                                  : "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                                {userItem.name || "Unnamed User"}
                              </h4>
                              {isCurrentUser && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground block">
                              ID: {id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Email Address */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="size-3.5 text-primary shrink-0" />
                          <span className="text-foreground font-medium">
                            {userItem.email}
                          </span>
                        </div>
                      </td>

                      {/* 3. Role */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleObj.badgeColor}`}
                        >
                          <RoleIcon className="size-3.5" />
                          <span className="capitalize">{userItem.role || "Customer"}</span>
                        </span>
                      </td>

                      {/* 4. Joined Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-muted-foreground text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground/70" />
                          <span>{joinedDate}</span>
                        </div>
                      </td>

                      {/* 5. Actions (Change Role, Manage Users) */}
                      <td className="py-4 px-4 whitespace-nowrap text-right pr-6">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Change Role Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleModal(userItem)}
                            className="h-8 px-2.5 text-xs gap-1.5 hover:border-primary/50"
                            title="Change user access role"
                          >
                            <ShieldCheck className="size-3.5 text-primary" />
                            <span>Change Role</span>
                          </Button>

                          {/* Manage Users Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenManageModal(userItem)}
                            className="h-8 px-2.5 text-xs gap-1.5 hover:bg-muted"
                            title="Manage user details"
                          >
                            <Pencil className="size-3.5" />
                            <span>Manage</span>
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isCurrentUser}
                            onClick={() => setUserToDelete(userItem)}
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title={
                              isCurrentUser
                                ? "Cannot delete own account"
                                : "Delete user"
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ======================================================== */}
      {/* 1. CHANGE ROLE MODAL */}
      {/* ======================================================== */}
      <Dialog
        open={!!userForRoleChange}
        onOpenChange={(open) => {
          if (!open) setUserForRoleChange(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <span>Change User Role</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Select an access level for{" "}
              <strong className="text-foreground">{userForRoleChange?.name}</strong> (
              {userForRoleChange?.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {ROLES.map((roleOption) => {
              const Icon = roleOption.icon
              const isSelected = targetRole === roleOption.value

              return (
                <div
                  key={roleOption.value}
                  onClick={() => setTargetRole(roleOption.value)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/70 hover:border-primary/40 bg-card"
                  }`}
                >
                  <div
                    className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground">
                        {roleOption.label}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {roleOption.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUserForRoleChange(null)}
              disabled={isUpdatingRole}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRoleChange}
              disabled={isUpdatingRole}
              className="gap-2 font-semibold"
            >
              {isUpdatingRole ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Updating Role...</span>
                </>
              ) : (
                <span>Confirm Role Change</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* 2. MANAGE USERS MODAL */}
      {/* ======================================================== */}
      <Dialog
        open={!!userToManage}
        onOpenChange={(open) => {
          if (!open) setUserToManage(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Pencil className="size-5 text-primary" />
              <span>Manage User Account</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Modify account attributes and access permissions for this member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveManageUser} className="space-y-4 pt-2">
            {/* User overview banner */}
            <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60 flex items-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0">
                {userToManage?.name ? userToManage.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {userToManage?.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {userToManage?.email}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="manage-name" className="text-xs font-semibold">
                Full Display Name
              </Label>
              <Input
                id="manage-name"
                value={manageName}
                onChange={(e) => setManageName(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="manage-role" className="text-xs font-semibold">
                Platform Role
              </Label>
              <select
                id="manage-role"
                value={manageRole}
                onChange={(e) => setManageRole(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs sm:text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="customer" className="bg-popover text-popover-foreground">
                  Customer (Standard User)
                </option>
                <option value="owner" className="bg-popover text-popover-foreground">
                  Owner (Equipment Supplier)
                </option>
                <option value="admin" className="bg-popover text-popover-foreground">
                  Admin (Super Administrator)
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Registered Email (Read-only)
              </Label>
              <Input
                value={userToManage?.email || ""}
                disabled
                className="text-xs sm:text-sm bg-muted/50 cursor-not-allowed"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUserToManage(null)}
                disabled={isSavingUser}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSavingUser}
                className="gap-2 font-semibold"
              >
                {isSavingUser ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Account Details</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* 3. DELETE USER CONFIRMATION DIALOG */}
      {/* ======================================================== */}
      <Dialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="size-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete User Account?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{userToDelete?.name}</strong> (
              {userToDelete?.email})? This action cannot be undone and will revoke their account access.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUserToDelete(null)}
              disabled={isDeletingUser}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDeleteUser}
              disabled={isDeletingUser}
              className="gap-2 font-semibold"
            >
              {isDeletingUser ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Delete Account</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
