import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CameraOff } from "lucide-react";

// 👇 Import local images
import img1 from "@/images/img1.jpg";
import img2 from "@/images/img1.jpg";
import img3 from "@/images/img1.jpg";
import img4 from "@/images/img1.jpg";

const images = [img1, img2, img3, img4];

interface TrafficCameraFeedProps {
  id: string;
  title: string;
  location: string;
  status: "active" | "warning" | "error";
  vehicleCount?: number;
  congestionLevel?: "low" | "medium" | "high";
  className?: string;
}

export function TrafficCameraFeed({
  id,
  title,
  location,
  status,
  vehicleCount = 0,
  congestionLevel,
  className
}: TrafficCameraFeedProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [currentVehicleCount, setCurrentVehicleCount] = useState(vehicleCount);
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setCurrentVehicleCount((prevCount) => prevCount + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentImage = images[imageIndex];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <Badge
          variant="outline"
          className={cn("px-2 py-0", {
            "bg-traffic-green/10 text-traffic-green border-traffic-green/20": status === "active",
            "bg-traffic-amber/10 text-traffic-amber border-traffic-amber/20": status === "warning",
            "bg-traffic-red/10 text-traffic-red border-traffic-red/20": status === "error",
          })}
        >
          <span
            className={cn("mr-1 h-1.5 w-1.5 rounded-full inline-block", {
              "bg-traffic-green animate-pulse-green": status === "active",
              "bg-traffic-amber animate-pulse-amber": status === "warning",
              "bg-traffic-red animate-pulse-red": status === "error",
            })}
          />
          {status === "active" ? "Live" : status === "warning" ? "Warning" : "Offline"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted">
          {imageLoaded ? (
            <img
              src={currentImage}
              alt={`Traffic camera ${id}`}
              className="h-full w-full object-cover"
              onError={() => setImageLoaded(false)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <CameraOff className="h-8 w-8" />
                <p className="text-xs">Feed unavailable</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              {currentVehicleCount} vehicles
            </Badge>
            {congestionLevel && imageLoaded && (
              <Badge
                variant="secondary"
                className={cn("border-0 text-white", {
                  "bg-traffic-green/70": congestionLevel === "low",
                  "bg-traffic-amber/70": congestionLevel === "medium",
                  "bg-traffic-red/70": congestionLevel === "high",
                })}
              >
                {congestionLevel} congestion
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
