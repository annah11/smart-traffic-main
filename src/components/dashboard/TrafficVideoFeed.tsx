import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Camera, Video, VideoOff, Pause, Play } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Updated video sources with your links
  const videoSources: Record<string, string> = {
    'video-1': 'https://v.ftcdn.net/02/44/10/34/700_F_244103433_SU95HFaIvOm46LkLot5Hex4DuNTK2WgK_ST.mp4',
    'video-2': 'https://videocdn.cdnpk.net/videos/ec7e18ad-02b3-4291-8f21-944b6546028c/horizontal/previews/videvo_watermarked/small.mp4',
    'video-3': 'https://v.ftcdn.net/02/44/10/34/700_F_244103433_SU95HFaIvOm46LkLot5Hex4DuNTK2WgK_ST.mp4',
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && status === 'active') {
        videoRef.current.play().catch(error => {
          console.error("Video playback failed:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, status]);

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

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
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay={isPlaying}
              >
                <source src={videoSources[id] || videoSources['video-1']} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={togglePlayback}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
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
