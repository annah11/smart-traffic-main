import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Grid2X2, Layout, Maximize2 } from "lucide-react";
import { TrafficVideoFeed } from "@/components/dashboard/TrafficVideoFeed";
import { TrafficCameraFeed } from "@/components/dashboard/TrafficCameraFeed";
import { trafficCameraData } from "@/utils/mockData";

type ViewMode = "grid" | "list";
type FeedType = "all" | "video" | "camera";

const CameraFeedsView = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [feedType, setFeedType] = useState<FeedType>("all");

  const videoFeeds = [
    {
      id: "video-1",
      title: "Meskel Square Live Feed",
      location: "Meskel Square, Addis Ababa",
      status: "active" as const,
    },
    {
      id: "video-2",
      title: "Bole Road Live Feed",
      location: "Bole Road, Addis Ababa",
      status: "active" as const,
    }
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Camera className="h-6 w-6" />
                  Camera Feeds
                </h1>
                <p className="text-muted-foreground">Monitor all traffic cameras and video feeds</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border bg-card p-1">
                  <Button
                    variant={feedType === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFeedType("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={feedType === "video" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFeedType("video")}
                  >
                    Video
                  </Button>
                  <Button
                    variant={feedType === "camera" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFeedType("camera")}
                  >
                    Camera
                  </Button>
                </div>
                
                <div className="flex items-center rounded-lg border bg-card p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <Layout className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {(feedType === "all" || feedType === "video") && (
                videoFeeds.map(feed => (
                  <TrafficVideoFeed
                    key={feed.id}
                    {...feed}
                    className={viewMode === "list" ? "sm:h-[300px]" : ""}
                  />
                ))
              )}
              
              {(feedType === "all" || feedType === "camera") && (
                trafficCameraData.map(camera => (
                  <TrafficCameraFeed
                    key={camera.id}
                    {...camera}
                    className={viewMode === "list" ? "sm:h-[300px]" : ""}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CameraFeedsView;