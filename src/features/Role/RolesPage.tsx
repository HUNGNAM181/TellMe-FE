"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useRoles } from "@/features/Role/useRoles";
import RoleDialog, { type RoleDialogMode } from "@/features/Role/components/RoleDialog";
import type { RoleBriefDto, RoleFormValues } from "@/types/role.type";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomPagination } from "@/components/ui/CustomPagination";

export default function RolesPage() {
  const {
    total,
    filter,
    setFilter,
    roles,
    permissions,
    loading,
    loadingPermissions,
    createRole,
    updateRole,
    deleteRole,
    currentRole,
    setCurrentRole,
    loadRoleById,
  } = useRoles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<RoleDialogMode>("create");
  const [dialogInitialValues, setDialogInitialValues] = useState<RoleFormValues>({
    name: "",
    description: "",
    isActive: true,
    permissionIds: [],
  });
  const [search, setSearch] = useState(filter.text);
  const debouncedSearchTerm = useDebounce(search, 500);

  const filteredRoles = useMemo(
    () => roles.filter((role) => role.name.toString().toLowerCase().includes(filter.text.toLowerCase())),
    [roles, filter.text],
  );

  const totalPages = useMemo(() => {
    if (!total || !filter.limit) return 1;
    return Math.max(1, Math.ceil(total / filter.limit));
  }, [total, filter.limit]);

  useEffect(() => {
    setFilter({ text: debouncedSearchTerm });
  }, [debouncedSearchTerm, setFilter]);

  const openCreateDialog = () => {
    setCurrentRole(null);
    setDialogMode("create");
    setDialogInitialValues({ name: "", description: "", isActive: true, permissionIds: [] });
    setDialogOpen(true);
  };

  const openEditDialog = async (role: RoleBriefDto) => {
    try {
      const full = await loadRoleById(role.id);
      if (!full) return;

      setDialogMode("edit");
      setDialogInitialValues({
        name: full.name,
        description: full.description ?? "",
        isActive: full.isActive,
        permissionIds: full.permissions.map((p) => p.id),
      });
      setDialogOpen(true);
    } catch {
      // error đã được xử lý trong hook (toast)
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRole(id);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Search roles by name..."
          className="w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button size="sm" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          New Role
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  Loading roles...
                </TableCell>
              </TableRow>
            ) : filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "default" : "outline"}>
                      {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                      {role.description ? (
                        <span>{role.description}</span>
                      ) : (
                        <span className="text-muted-foreground">No description</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(role)}
                      className="h-8 px-2 text-xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <ConfirmModal
                      title="Delete role"
                      description="Are you sure you want to delete this role? This action cannot be undone."
                      onConfirm={() => handleDelete(role.id)}
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
              <TableCell colSpan={4}>
                <div className="flex justify-center py-2">
                  <CustomPagination
                    page={filter.page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setFilter({ page: newPage })}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <RoleDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={dialogInitialValues}
        permissions={permissions}
        loadingPermissions={loadingPermissions}
        onOpenChange={setDialogOpen}
        onSubmit={async (values) => {
          if (dialogMode === "edit" && currentRole) {
            await updateRole({ id: currentRole.id, ...values });
          } else {
            await createRole(values);
          }
        }}
      />
    </div>
  );
}
