
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface TrafficMapProps {
  className?: string;
}

export function TrafficMap({ className }: TrafficMapProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Traffic Density Map</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className="relative h-full w-full min-h-[300px] bg-sidebar-accent rounded overflow-hidden">
          <div className="absolute inset-0">
            {/* This would be replaced with an actual map component in production */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">Map visualization will appear here</p>
            </div>
            
            {/* Sample traffic hotspots */}
            <div className="absolute top-1/4 left-1/4 h-8 w-8 rounded-full bg-traffic-red/30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 h-10 w-10 rounded-full bg-traffic-amber/30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 h-6 w-6 rounded-full bg-traffic-green/30 animate-pulse"></div>
            
            {/* Sample traffic light markers */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-traffic-red text-white rounded-full p-1">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-traffic-amber text-white rounded-full p-1">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-traffic-green text-white rounded-full p-1">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
