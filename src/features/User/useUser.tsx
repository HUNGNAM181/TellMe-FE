"use client";

import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import userService from "@/services/user.service";
import roleService from "@/services/role.service";

import { Pagination } from "@/types/api.types";
import { RoleBriefDto } from "@/types/role.type";
import { UserDto, CreateUserPayload, UpdateUserPayload } from "@/types/user.types";

interface UseUsersOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UseUsersState {
  users: UserDto[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error?: string | null;
}

interface UseRolesState {
  roles: RoleBriefDto[];
  loadingRoles: boolean;
}

export interface UserFilter extends Pick<Pagination, "page" | "limit"> {
  text: string;
  roleId?: string;
}

export function useUsers(options?: UseUsersOptions) {
  const { initialPage = 1, initialLimit = 20 } = options || {};
  const { toast } = useToast();

  const [state, setState] = useState<UseUsersState>({
    users: [],
    total: 0,
    page: initialPage,
    limit: initialLimit,
    loading: false,
    error: null,
  });

  const [rolesState, setRolesState] = useState<UseRolesState>({
    roles: [],
    loadingRoles: false,
  });

  const [filter, setFilterState] = useState<UserFilter>({
    text: "",
    page: initialPage,
    limit: initialLimit,
  });

  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUsers = useCallback(
    async (override?: Partial<UserFilter>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const page = override?.page ?? filter.page;
        const limit = override?.limit ?? filter.limit;
        const text = override?.text ?? filter.text;
        const roleId = override?.roleId ?? filter.roleId;

        const res = await userService.getUsers({
          page,
          limit,
          username: text?.trim() || undefined,
          roleId: roleId || undefined,
        });

        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to load users");
        }

        setState((prev) => ({
          ...prev,
          users: res.data || [],
          total: res.total ?? prev.total,
          page: res.page ?? page,
          limit: res.limit ?? limit,
          loading: false,
        }));
      } catch (error: any) {
        const message = error?.message || "Failed to load users";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));

        toast({
          title: "Error",
          description: message,
        });
      }
    },
    [filter.page, filter.limit, filter.text, filter.roleId, toast],
  );

  const fetchRoles = useCallback(async () => {
    setRolesState((prev) => ({ ...prev, loadingRoles: true }));

    try {
      const res = await roleService.getRoles({ page: 1, limit: 20 });

      if (!res.isSuccess) {
        throw new Error(res.errorMessage || "Failed to load roles");
      }

      setRolesState({
        roles: res.data || [],
        loadingRoles: false,
      });
    } catch (error: any) {
      const message = error?.message || "Failed to load roles";

      setRolesState((prev) => ({
        ...prev,
        loadingRoles: false,
      }));

      toast({
        title: "Error",
        description: message,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const loadUserById = useCallback(
    async (id: string) => {
      setLoadingUser(true);

      try {
        const res = await userService.getUserById(id);

        if (!res.isSuccess || !res.data) {
          throw new Error(res.errorMessage || "Failed to load user detail");
        }

        setCurrentUser(res.data);

        return res.data;
      } catch (error: any) {
        const message = error?.message || "Failed to load user detail";

        toast({
          title: "Error",
          description: message,
        });

        throw error;
      } finally {
        setLoadingUser(false);
      }
    },
    [toast],
  );

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      try {
        const res = await userService.createUser(payload);

        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to create user");
        }

        toast({
          title: "User created",
          description: res.successMessage || "The user has been created successfully.",
        });

        await fetchUsers();

        return res.data ?? null;
      } catch (error: any) {
        const message = error?.message || "Failed to create user";

        toast({
          title: "Error",
          description: message,
        });

        throw error;
      }
    },
    [fetchUsers, toast],
  );

  const updateUser = useCallback(
    async (id: string, payload: UpdateUserPayload) => {
      try {
        const res = await userService.updateUser(id, payload);

        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to update user");
        }

        toast({
          title: "User updated",
          description: res.successMessage || "The user has been updated successfully.",
        });

        await fetchUsers();

        return res.data ?? null;
      } catch (error: any) {
        const message = error?.message || "Failed to update user";

        toast({
          title: "Error",
          description: message,
        });

        throw error;
      }
    },
    [fetchUsers, toast],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const res = await userService.deleteUser(id);

        if (!res.isSuccess) {
          throw new Error(res.errorMessage || "Failed to delete user");
        }

        toast({
          title: "User deleted",
          description: res.successMessage || "The user has been deleted successfully.",
        });

        await fetchUsers();

        return true;
      } catch (error: any) {
        const message = error?.message || "Failed to delete user";

        toast({
          title: "Error",
          description: message,
        });

        throw error;
      }
    },
    [fetchUsers, toast],
  );

  const setFilter = useCallback(
    (update: Partial<UserFilter>) => {
      setFilterState((prev) => {
        const next: UserFilter = {
          ...prev,
          ...update,
        };

        fetchUsers(next);

        return next;
      });
    },
    [fetchUsers],
  );

  return {
    users: state.users,
    total: state.total,
    page: state.page,
    limit: state.limit,
    loading: state.loading,
    error: state.error,

    filter,
    setFilter,

    roles: rolesState.roles,
    loadingRoles: rolesState.loadingRoles,

    currentUser,
    setCurrentUser,
    loadingUser,
    loadUserById,

    refetchUsers: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
