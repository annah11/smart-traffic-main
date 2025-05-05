
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SystemComponentStatus } from "@/utils/types";

interface SystemStatusItemProps {
  name: string;
  status: SystemComponentStatus;
  uptime?: string;
  load?: number;
}

interface SystemStatusCardProps {
  items: SystemStatusItemProps[];
  className?: string;
}

export function SystemStatusCard({ items, className }: SystemStatusCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <span
                    className={cn("mr-2 h-2 w-2 rounded-full", {
                      "bg-traffic-green": item.status === "operational",
                      "bg-traffic-amber": item.status === "degraded",
                      "bg-traffic-red": item.status === "outage",
                    })}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {item.uptime && (
                  <span className="text-xs text-muted-foreground">
                    Uptime: {item.uptime}
                  </span>
                )}
              </div>
              {item.load !== undefined && (
                <div className="flex items-center gap-2">
                  <Progress
                    value={item.load}
                    className={cn("h-2 w-24", {
                      "bg-traffic-green": item.load < 50,
                      "bg-traffic-amber": item.load >= 50 && item.load < 80,
                      "bg-traffic-red": item.load >= 80,
                    })}
                  />
                  <span className="text-xs w-8 text-right">{item.load}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
