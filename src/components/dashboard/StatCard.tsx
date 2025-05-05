import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getStatCardData } from "@/lib/statCardData";

interface StatCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  id,
  title,
  description,
  icon,
  trend,
  className
}: StatCardProps) {
  const [value, setValue] = useState<string | number | null>(null);

  useEffect(() => {
    getStatCardData(id, (data) => {
      setValue(data);
    });

    // Cleanup function (optional, but good practice)
    return () => {
      // Any cleanup logic here (e.g., unsubscribe from Firebase)
    };
  }, [id]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value !== null ? value : "Loading..."}</div>
        {trend && (
          <p className="flex items-center text-xs text-muted-foreground">
            <span
              className={cn(
                "mr-1",
                trend.isPositive ? "text-traffic-green" : "text-traffic-red"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
            {description}
          </p>
        )}
        {!trend && description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}