"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserPlus, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Add User",
    href: "/dashboard/add",
    icon: UserPlus,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-background border-r overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-4 border-b">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="ml-3 text-xl font-bold font-geist-sans">User Hub</h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground group",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-geist-sans">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="ml-3 text-xl font-bold font-geist-sans">User Hub</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-geist-sans">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
    </>
  );
}