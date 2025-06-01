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
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 transition-transform duration-300",
        isOpen ? "lg:translate-x-0" : "lg:-translate-x-64"
      )}>
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
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
        "bg-background border-r border-border shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="ml-3 text-xl font-bold font-geist-sans text-foreground">User Hub</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto bg-background">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary/20 shadow-sm"
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
    </>
  );
}