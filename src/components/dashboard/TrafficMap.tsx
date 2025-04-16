
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TrafficMapProps {
  className?: string;
}

export function TrafficMap({ className }: TrafficMapProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">Traffic Density Map</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className="relative h-full w-full min-h-[200px] sm:min-h-[300px] bg-sidebar-accent rounded overflow-hidden">
          <div className="absolute inset-0">
            {/* This would be replaced with an actual map component in production */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground text-xs sm:text-sm">Map visualization will appear here</p>
            </div>
            
            {/* Sample traffic hotspots */}
            <div className="absolute top-1/4 left-1/4 h-5 w-5 sm:h-8 sm:w-8 rounded-full bg-traffic-red/30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 h-6 w-6 sm:h-10 sm:w-10 rounded-full bg-traffic-amber/30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-traffic-green/30 animate-pulse"></div>
            
            {/* Sample traffic light markers */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-traffic-red text-white rounded-full p-0.5 sm:p-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-traffic-amber text-white rounded-full p-0.5 sm:p-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-traffic-green text-white rounded-full p-0.5 sm:p-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
