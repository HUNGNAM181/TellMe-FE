"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { roleFormSchema } from "@/features/Role/role.schema";
import type { PermissionDto } from "@/types/permission.type";
import type { RoleFormValues } from "@/types/role.type";

export type RoleDialogMode = "create" | "edit";

interface RoleDialogProps {
  open: boolean;
  mode: RoleDialogMode;
  initialValues: RoleFormValues;
  permissions: PermissionDto[];
  loadingPermissions: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RoleFormValues) => Promise<void> | void;
}

export function RoleDialog({
  open,
  mode,
  initialValues,
  permissions,
  loadingPermissions,
  onOpenChange,
  onSubmit,
}: RoleDialogProps) {
  const [formValues, setFormValues] = useState<RoleFormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RoleFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<RoleFormValues | null>(null);

  useEffect(() => {
    if (open) {
      setFormValues(initialValues);
      setFormErrors({});
    }
  }, [open, initialValues]);

  const togglePermission = (permissionId: string) => {
    setFormValues((prev) => {
      const exists = prev.permissionIds.includes(permissionId);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((id) => id !== permissionId)
          : [...prev.permissionIds, permissionId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = roleFormSchema.safeParse(formValues);
      if (!result.success) {
        const fieldErrors: Partial<Record<keyof RoleFormValues, string>> = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof RoleFormValues;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });
        setFormErrors(fieldErrors);
        return;
      }
      setFormErrors({});
      setPendingValues(result.data);
      setConfirmOpen(true);
    } finally {
      // không đổi submitting ở đây, chỉ dùng cho bước confirm
    }
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;
    setSubmitting(true);
    try {
      await onSubmit(pendingValues);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
      setPendingValues(null);
    }
  };

  const title = mode === "edit" ? "Edit role" : "Create new role";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-3">
            <Label htmlFor="role-name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role-name"
              placeholder="e.g. Administrator"
              value={formValues.name}
              onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
            />
            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="role-description">Description</Label>
            <Input
              id="role-description"
              placeholder="Short description of this role"
              value={formValues.description || ""}
              onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))}
            />
            {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
          </div>

          <div className="flex items-center gap-2 rounded-md border px-3 py-2 bg-muted/40">
            <input
              id="role-active"
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={!!formValues.isActive}
              onChange={(e) => setFormValues((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <div className="space-y-0.5">
              <Label htmlFor="role-active" className="text-sm font-medium">
                Active
              </Label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Permissions</Label>
              <p className="text-xs text-muted-foreground">Select one or more permissions for this role.</p>
            </div>

            <div className="border rounded-md max-h-60 overflow-auto p-2 space-y-1 text-sm bg-muted/20">
              {loadingPermissions ? (
                <div className="text-muted-foreground text-xs px-2 py-1">Loading permissions...</div>
              ) : permissions.length === 0 ? (
                <div className="text-muted-foreground text-xs px-2 py-1">No permissions available.</div>
              ) : (
                permissions.map((permission) => {
                  const checked = formValues.permissionIds.includes(permission.id);
                  return (
                    <label
                      key={permission.id}
                      className="flex items-center justify-between gap-2 px-2 py-1 rounded-md hover:bg-muted cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{permission.name}</span>
                        {permission.description && (
                          <span className="text-xs text-muted-foreground line-clamp-2">{permission.description}</span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-primary"
                        checked={checked}
                        onChange={() => togglePermission(permission.id)}
                      />
                    </label>
                  );
                })
              )}
            </div>
            {formErrors.permissionIds && <p className="text-xs text-red-500">{formErrors.permissionIds}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="min-w-[120px]">
              {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create role"}
            </Button>
          </DialogFooter>
        </form>

        <ConfirmModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={mode === "edit" ? "Confirm update" : "Confirm create"}
          description={
            mode === "edit"
              ? "Are you sure you want to save these changes?"
              : "Are you sure you want to create this role?"
          }
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
}

export default RoleDialog;
