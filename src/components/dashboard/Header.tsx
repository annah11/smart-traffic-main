
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-base sm:text-lg font-semibold truncate">
          {isMobile ? "Traffic Dashboard" : "Smart Traffic Management Dashboard"}
        </h1>
      </div>
      
      <div className="relative hidden sm:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-[200px] bg-background pl-8"
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="relative"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-traffic-amber text-[10px] text-white">
          2
        </span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:flex"
      >
        <Sun className="mr-2 h-4 w-4" />
        Light
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </header>
  );
}
