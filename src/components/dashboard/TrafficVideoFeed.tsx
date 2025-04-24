
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Camera, Video, VideoOff } from "lucide-react";
import { CameraStatus } from "@/utils/types";

interface TrafficVideoFeedProps {
  id: string;
  title: string;
  location: string;
  status: CameraStatus;
  className?: string;
}

export function TrafficVideoFeed({
  id,
  title,
  location,
  status,
  className
}: TrafficVideoFeedProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const frames = [
    'https://placehold.co/600x400/232323/e6e6e6.png?text=Traffic+Feed+1',
    'https://placehold.co/600x400/232323/e6e6e6.png?text=Traffic+Feed+2',
    'https://placehold.co/600x400/232323/e6e6e6.png?text=Traffic+Feed+3'
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && status === 'active') {
      intervalId = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, status]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "px-2 py-0",
            {
              "bg-traffic-green/10 text-traffic-green border-traffic-green/20": status === "active",
              "bg-traffic-amber/10 text-traffic-amber border-traffic-amber/20": status === "warning",
              "bg-traffic-red/10 text-traffic-red border-traffic-red/20": status === "error",
            }
          )}
        >
          <span className={cn(
            "mr-1 h-1.5 w-1.5 rounded-full inline-block",
            {
              "bg-traffic-green animate-pulse-green": status === "active",
              "bg-traffic-amber animate-pulse-amber": status === "warning",
              "bg-traffic-red animate-pulse-red": status === "error",
            }
          )} />
          {status === "active" ? "Live" : status === "warning" ? "Warning" : "Offline"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted">
          {status === "active" ? (
            <>
              <img
                src={frames[currentFrame]}
                alt={`Traffic video feed ${id}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </button>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8" />
                <p className="text-xs">Feed unavailable</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
