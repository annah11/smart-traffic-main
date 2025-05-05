
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

export function DashboardHeader() {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="flex h-12 sm:h-14 items-center gap-2 sm:gap-4 border-b bg-card px-2 sm:px-6">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
      <div className="flex flex-1 items-center gap-1 sm:gap-2 overflow-hidden">
        <h1 className="text-sm sm:text-lg font-semibold truncate">
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
        className="relative h-8 w-8 sm:h-9 sm:w-9"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-traffic-amber text-[10px] text-white">
          2
        </span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="hidden sm:flex items-center"
      >
        {theme === 'dark' ? (
          <>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </>
        ) : (
          <>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </>
        )}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </header>
  );
}

