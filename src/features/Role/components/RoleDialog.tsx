"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    setSubmitting(true);
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

      await onSubmit(result.data);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "edit" ? "Edit Role" : "Create Role";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="role-name">Name</Label>
            <Input
              id="role-name"
              value={formValues.name}
              onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
            />
            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">Description</Label>
            <Input
              id="role-description"
              value={formValues.description || ""}
              onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))}
            />
            {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="border rounded-md max-h-48 overflow-auto p-2 space-y-1 text-sm">
              {loadingPermissions ? (
                <div className="text-muted-foreground text-xs">Loading permissions...</div>
              ) : permissions.length === 0 ? (
                <div className="text-muted-foreground text-xs">No permissions available.</div>
              ) : (
                permissions.map((permission) => {
                  const checked = formValues.permissionIds.includes(permission.id);
                  return (
                    <label
                      key={permission.id}
                      className="flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-muted/60 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{permission.name}</span>
                        {permission.description && (
                          <span className="text-xs text-muted-foreground">{permission.description}</span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="h-3 w-3"
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
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoleDialog;
