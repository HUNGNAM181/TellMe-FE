"use client";

import React, { useState } from "react";
import { Users, UserCog } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserManagementTabs() {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  return (
    <div className="max-w-5xl mx-auto">
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

function UsersPage() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Manage users and assign roles.</div>

      <div className="border rounded-lg p-4">
        <p className="font-medium">User List (Demo)</p>
        <ul className="mt-2 text-sm space-y-1">
          <li>• john@example.com - Admin</li>
          <li>• anna@example.com - Member</li>
          <li>• david@example.com - Member</li>
        </ul>
      </div>
    </div>
  );
}

function RolesPage() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">Manage roles and permissions.</div>

      <div className="border rounded-lg p-4">
        <p className="font-medium">Role List (Demo)</p>
        <ul className="mt-2 text-sm space-y-1">
          <li>• Admin - Full access</li>
          <li>• Member - Limited access</li>
        </ul>
      </div>
    </div>
  );
}
