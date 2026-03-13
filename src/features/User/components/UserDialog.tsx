"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarUpload from "@/features/User/components/AvatarUpload";
import { UserFormValues } from "@/types/userForm.type";

import { createUserSchema, updateUserSchema } from "@/features/User/user.schema";

import type { RoleBriefDto } from "@/types/role.type";

import fileService from "@/services/upfile.service";

export type UserDialogMode = "create" | "edit";

interface UserDialogProps {
  open: boolean;
  mode: UserDialogMode;
  roles: RoleBriefDto[];
  initialValues: UserFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

export function UserDialog({ open, mode, roles, initialValues, onOpenChange, onSubmit }: UserDialogProps) {
  const [formValues, setFormValues] = useState<UserFormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<UserFormValues | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    if (open) {
      setFormValues({
        isActive: true,
        ...initialValues,
      });

      setFormErrors({});
      setAvatarFile(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open, initialValues]);

  const handleChange = <K extends keyof UserFormValues>(field: K, value: UserFormValues[K]) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schema = mode === "create" ? createUserSchema : updateUserSchema;
    const result = schema.safeParse(formValues);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      });

      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setPendingValues(result.data);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;

    setSubmitting(true);

    try {
      let avatarUrl = pendingValues.profileImageUrl ?? null;

      if (avatarFile) {
        const res = await fileService.uploadAvatar(avatarFile);

        if (res.isSuccess) {
          avatarUrl = res.data.fileUrl;
        }
      }

      const payload = {
        ...pendingValues,
        profileImageUrl: avatarUrl,
      };

      console.log("PAYLOAD", payload);

      await onSubmit(payload);
      setShowPassword(false);
      setShowConfirmPassword(false);

      onOpenChange(false);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
      setPendingValues(null);
    }
  };

  const title = mode === "edit" ? "Edit User" : "Create New User";

  const renderError = (field: string) =>
    formErrors[field] && <p className="text-xs text-red-500 mt-1">{formErrors[field]}</p>;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (isPreviewOpen) return;
          onOpenChange(nextOpen);
        }}
      >
        <DialogContent
          className="max-w-2xl"
          onPointerDownOutside={(e) => {
            if (isPreviewOpen) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (isPreviewOpen) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-2 gap-4">
              {mode === "create" && (
                <div className="space-y-3">
                  <Label>
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input value={formValues.username || ""} onChange={(e) => handleChange("username", e.target.value)} />
                  {renderError("username")}
                </div>
              )}

              <div className="space-y-3">
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input value={formValues.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                {renderError("name")}
              </div>

              <div className="space-y-3 col-span-2">
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={formValues.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {renderError("email")}
              </div>

              {mode === "create" && (
                <>
                  <div className="space-y-3">
                    <Label>
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formValues.password || ""}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {renderError("password")}
                  </div>

                  <div className="space-y-3">
                    <Label>
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formValues.confirmPassword || ""}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {renderError("confirmPassword")}
                  </div>
                </>
              )}

              <div className="space-y-3 col-span-2">
                <Label>
                  Role <span className="text-red-500">*</span>
                </Label>

                <Select value={formValues.roleId || ""} onValueChange={(value) => handleChange("roleId", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {renderError("roleId")}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Avatar</Label>
              </div>
              <AvatarUpload
                value={formValues.profileImageUrl}
                apiUrl={process.env.NEXT_PUBLIC_API_URL}
                onPreviewChange={setIsPreviewOpen}
                onChange={(file) => {
                  setAvatarFile(file);
                  setFormValues((prev) => ({
                    ...prev,
                    profileImageUrl: file ? undefined : null,
                  }));
                }}
              />
            </div>

            <div className="inline-flex items-center gap-3 border rounded-md px-4 py-3 bg-muted/40">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={!!formValues.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
              <Label className="text-sm cursor-pointer">Active User</Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={mode === "edit" ? "Confirm Update" : "Confirm Create"}
        description={
          mode === "edit" ? "Are you sure you want to update this user?" : "Are you sure you want to create this user?"
        }
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default UserDialog;
