
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
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
     
      
     
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 shrink-0 sm:h-9 sm:w-auto sm:min-w-0 sm:px-3 sm:gap-2"
      >
        {theme === 'dark' ? (
          <>
            <Sun className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Dark</span>
          </>
        )}
      </Button>
    </header>
  );
}

