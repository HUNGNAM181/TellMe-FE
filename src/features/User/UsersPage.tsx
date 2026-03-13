"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

import { useDebounce } from "@/hooks/useDebounce";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { useUsers } from "@/features/User/useUser";
import { UserDto } from "@/types/user.types";
import { UserFormValues } from "@/types/userForm.type";
import type { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";
import UserDialog, { type UserDialogMode } from "@/features/User/components/UserDialog";

export default function UsersPage() {
  const { users, roles, total, filter, setFilter, loading, deleteUser, createUser, updateUser } = useUsers();

  const [search, setSearch] = useState(filter.text);
  const debouncedSearchTerm = useDebounce(search, 500);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<UserDialogMode>("create");

  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [dialogInitialValues, setDialogInitialValues] = useState<UserFormValues>({});

  const totalPages = useMemo(() => {
    if (!total || !filter.limit) return 1;
    return Math.max(1, Math.ceil(total / filter.limit));
  }, [total, filter.limit]);

  useEffect(() => {
    if (debouncedSearchTerm !== filter.text) {
      setFilter({
        ...filter,
        text: debouncedSearchTerm,
        page: 1,
      });
    }
  }, [debouncedSearchTerm]);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  const getRoleName = (user: UserDto) => {
    if (!user.roles?.length) return "No role";
    return user.roles.map((r) => r.name).join(", ");
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setEditingUserId(null);

    setDialogInitialValues({
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      roleId: "",
      isActive: true,
      profileImageUrl: null,
    });

    setDialogOpen(true);
  };

  const openEditDialog = (user: UserDto) => {
    setDialogMode("edit");
    setEditingUserId(user.id);

    setDialogInitialValues({
      email: user.email,
      name: user.name,
      roleId: user.roles?.[0]?.id ?? "",
      isActive: user.isActive,
      profileImageUrl: user.profileImageUrl,
    });

    setDialogOpen(true);
  };

  const handleSubmit = async (values: UserFormValues) => {
    if (dialogMode === "edit" && editingUserId) {
      await updateUser(editingUserId, values as UpdateUserPayload);
    } else {
      await createUser(values as CreateUserPayload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Search users by username..."
          className="w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button size="sm" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          New User
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-30 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>

                  <TableCell>{user.email ?? <span className="text-muted-foreground">No email</span>}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{getRoleName(user)}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>

                    <ConfirmModal
                      title="Delete user"
                      description="Are you sure you want to delete this user?"
                      onConfirm={() => handleDelete(user.id)}
                    >
                      <Button size="sm" variant="destructive" className="h-8 px-2 text-xs">
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </ConfirmModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex justify-center py-2">
                  <CustomPagination
                    page={filter.page}
                    totalPages={totalPages}
                    onPageChange={(page) => setFilter({ page })}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        roles={roles}
        initialValues={dialogInitialValues}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
