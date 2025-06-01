"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, User } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserType } from "@/lib/validation";

type LocalStorageUser = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
};

export default function DashboardPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch API users
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const apiUsers = await response.json();

      // Get localStorage users
      const localUsers = getLocalStorageUsers();

      // Combine API users and localStorage users
      const allUsers = [...apiUsers, ...localUsers];

      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();

    // Listen for storage changes to refresh when new users are added
    const handleStorageChange = () => {
      fetchUsers();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event when user is added in the same tab
    window.addEventListener('userAdded', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userAdded', handleStorageChange);
    };
  }, [fetchUsers]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const getLocalStorageUsers = (): UserType[] => {
    try {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        // Transform localStorage format to match API format
        return parsedUsers.map((user: LocalStorageUser, index: number) => ({
          id: `local-${Date.now()}-${index}`, // Generate unique ID for local users
          name: user.name,
          email: user.email,
          phone: user.phone || "N/A",
          address: {
            street: user.street,
            city: user.city,
            zipcode: user.zip
          }
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to parse localStorage users:", error);
      return [];
    }
  };

  if (error) {
    return (
      <div className="min-h-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
        </div>
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
              <Button onClick={fetchUsers} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
      </div>

      {/* Search and Add User */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/dashboard/add">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">City:</span> {user.address.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.address.street}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && searchTerm && (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>No users found matching &quot;{searchTerm}&quot;</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
