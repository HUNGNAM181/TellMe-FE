"use client";

import React, { useState } from "react";
import { Users, UserCog } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RolesPage from "@/features/Role/RolesPage";
import UsersPage from "@/features/User/UsersPage";

export default function UserManagementTabs() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  return (
    <div className="w-full mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Users className="w-5 h-5" />
            User & Role Management
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="users" className="space-y-6" onValueChange={(v) => setActiveTab(v as "users" | "roles")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>

              <TabsTrigger value="roles" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                Roles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">{activeTab === "users" && <UsersPage />}</TabsContent>

            <TabsContent value="roles">{activeTab === "roles" && <RolesPage />}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
