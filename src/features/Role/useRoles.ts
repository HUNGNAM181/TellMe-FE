"use client";

import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import roleService from "@/services/role.service";
import permissionService from "@/services/permission.service";
import { Pagination } from "@/types/api.types";
import { PermissionDto } from "@/types/permission.type";
import { CreateRoleDto, RoleBriefDto, RoleDto, UpdateRoleDto } from "@/types/role.type";

interface UseRolesOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UseRolesState {
  roles: RoleBriefDto[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error?: string | null;
}

interface UsePermissionsState {
  permissions: PermissionDto[];
  loadingPermissions: boolean;
}

export function useRoles(options?: UseRolesOptions) {
  const { initialPage = 1, initialLimit = 20 } = options || {};
  const { toast } = useToast();

  const [state, setState] = useState<UseRolesState>({
    roles: [],
    total: 0,
    page: initialPage,
    limit: initialLimit,
    loading: false,
    error: null,
  });

  const [permissionsState, setPermissionsState] = useState<UsePermissionsState>({
    permissions: [],
    loadingPermissions: false,
  });

  const [currentRole, setCurrentRole] = useState<RoleDto | null>(null);
  const [loadingRole, setLoadingRole] = useState(false);

  const fetchRoles = useCallback(
    async (override?: Pagination) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const page = override?.page ?? state.page;
        const limit = override?.limit ?? state.limit;
        const res = await roleService.getRoles({ page, limit });
        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to load roles");
        }
        setState((prev) => ({
          ...prev,
          roles: res.data || [],
          total: res.total ?? prev.total,
          page: res.page ?? page,
          limit: res.limit ?? limit,
          loading: false,
        }));
      } catch (error: any) {
        const message = error?.message || "Failed to load roles";
        setState((prev) => ({ ...prev, loading: false, error: message }));
        toast({
          title: "Error",
          description: message,
        });
      }
    },
    [state.page, state.limit, toast],
  );

  const fetchPermissions = useCallback(async () => {
    setPermissionsState((prev) => ({ ...prev, loadingPermissions: true }));
    try {
      const res = await permissionService.getAll({ page: 1, limit: 200 });
      if (!res.isSuccess) {
        throw new Error(res.errorMessage || "Failed to load permissions");
      }
      setPermissionsState({ permissions: res.data || [], loadingPermissions: false });
    } catch (error: any) {
      const message = error?.message || "Failed to load permissions";
      setPermissionsState((prev) => ({ ...prev, loadingPermissions: false }));
      toast({
        title: "Error",
        description: message,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRoleById = useCallback(
    async (id: string) => {
      setLoadingRole(true);
      try {
        const res = await roleService.getRoleById(id);
        if (!res.isSuccess || !res.data) {
          throw new Error(res.errorMessage || "Failed to load role detail");
        }
        setCurrentRole(res.data);
        return res.data;
      } catch (error: any) {
        const message = error?.message || "Failed to load role detail";
        toast({
          title: "Error",
          description: message,
        });
        throw error;
      } finally {
        setLoadingRole(false);
      }
    },
    [toast],
  );

  const createRole = useCallback(
    async (payload: CreateRoleDto) => {
      try {
        const res = await roleService.createRole(payload);
        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to create role");
        }
        toast({
          title: "Role created",
          description: res.successMessage || "The role has been created successfully.",
        });
        await fetchRoles();
        return res.data ?? null;
      } catch (error: any) {
        const message = error?.message || "Failed to create role";
        toast({
          title: "Error",
          description: message,
        });
        throw error;
      }
    },
    [fetchRoles, toast],
  );

  const updateRole = useCallback(
    async (payload: UpdateRoleDto) => {
      try {
        const res = await roleService.updateRole(payload);
        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to update role");
        }
        toast({
          title: "Role updated",
          description: res.successMessage || "The role has been updated successfully.",
        });
        await fetchRoles();
        return res.data ?? null;
      } catch (error: any) {
        const message = error?.message || "Failed to update role";
        toast({
          title: "Error",
          description: message,
        });
        throw error;
      }
    },
    [fetchRoles, toast],
  );

  const deleteRole = useCallback(
    async (id: string) => {
      try {
        const res = await roleService.deleteRole(id);
        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to delete role");
        }
        toast({
          title: "Role deleted",
          description: res.successMessage || "The role has been deleted successfully.",
        });
        await fetchRoles();
        return true;
      } catch (error: any) {
        const message = error?.message || "Failed to delete role";
        toast({
          title: "Error",
          description: message,
        });
        throw error;
      }
    },
    [fetchRoles, toast],
  );

  const setPage = (page: number) => {
    setState((prev) => ({ ...prev, page }));
    fetchRoles({ page, limit: state.limit });
  };

  const setLimit = (limit: number) => {
    setState((prev) => ({ ...prev, limit }));
    fetchRoles({ page: state.page, limit });
  };

  return {
    // roles
    roles: state.roles,
    total: state.total,
    page: state.page,
    limit: state.limit,
    loading: state.loading,
    error: state.error,

    // permissions
    permissions: permissionsState.permissions,
    loadingPermissions: permissionsState.loadingPermissions,

    // current role (for edit dialogs)
    currentRole,
    setCurrentRole,
    loadingRole,
    loadRoleById,

    // actions
    refetchRoles: fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    setPage,
    setLimit,
  };
}
