
import React, { useEffect, useRef, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Layers, ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { trafficLightData, trafficCameraData } from "@/utils/mockData";
import { TrafficLightColor } from "@/utils/types";

const MapPage = () => {
  const isMobile = useIsMobile();
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  const getMarkerColor = (color: TrafficLightColor | undefined) => {
    if (!color) return "bg-gray-400";
    
    switch(color) {
      case "red": return "bg-traffic-red";
      case "yellow": return "bg-traffic-amber";
      case "green": return "bg-traffic-green";
      default: return "bg-gray-400";
    }
  };

  const filteredMarkers = () => {
    if (activeLayer === "trafficLights") {
      return trafficLightData.map((light) => ({
        id: light.id,
        name: light.name,
        location: light.location,
        color: getMarkerColor(light.currentLight),
        type: "trafficLight",
        status: light.status,
        position: getRandomPosition(), // In a real app, these would be real coordinates
      }));
    } 
    else if (activeLayer === "cameras") {
      return trafficCameraData.map((camera) => ({
        id: camera.id,
        name: camera.title,
        location: camera.location,
        color: camera.status === "active" ? "bg-traffic-green" : 
               camera.status === "warning" ? "bg-traffic-amber" : "bg-traffic-red",
        type: "camera",
        status: camera.status,
        position: getRandomPosition(), // In a real app, these would be real coordinates
      }));
    } 
    else {
      // Show all markers
      return [
        ...trafficLightData.map((light) => ({
          id: light.id,
          name: light.name,
          location: light.location,
          color: getMarkerColor(light.currentLight),
          type: "trafficLight",
          status: light.status,
          position: getRandomPosition(),
        })),
        ...trafficCameraData.map((camera) => ({
          id: camera.id,
          name: camera.title,
          location: camera.location,
          color: camera.status === "active" ? "bg-traffic-green" : 
                camera.status === "warning" ? "bg-traffic-amber" : "bg-traffic-red",
          type: "camera",
          status: camera.status,
          position: getRandomPosition(),
        })),
      ];
    }
  };

  // Helper function to generate random positions for demo
  const getRandomPosition = () => {
    return {
      top: `${20 + Math.random() * 60}%`,
      left: `${20 + Math.random() * 60}%`,
    };
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <div className={`flex-1 flex flex-col ${isMobile ? "" : "ml-[240px]"} transition-all duration-300`}>
          <DashboardHeader />
          
          <div className="flex-1 p-3 sm:p-6 overflow-auto">
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold">Traffic Map</h1>
              <p className="text-muted-foreground">Real-time traffic monitoring map</p>
            </div>
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-medium">
                  City Traffic Map
                </CardTitle>
                
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant={activeLayer === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveLayer("all")}
                    className="text-xs sm:text-sm h-7 sm:h-8"
                  >
                    All
                  </Button>
                  <Button 
                    variant={activeLayer === "trafficLights" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveLayer("trafficLights")}
                    className="text-xs sm:text-sm h-7 sm:h-8"
                  >
                    Traffic Lights
                  </Button>
                  <Button 
                    variant={activeLayer === "cameras" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveLayer("cameras")}
                    className="text-xs sm:text-sm h-7 sm:h-8"
                  >
                    Cameras
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-[70vh] relative bg-muted/20 overflow-hidden border-t"
                  style={{transform: `scale(${zoomLevel})`}}
                >
                  {/* Map grid lines for visualization */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-muted/30"></div>
                    ))}
                  </div>
                  
                  {/* City streets visualization */}
                  <div className="absolute inset-0">
                    <div className="absolute left-[10%] right-[10%] top-[50%] h-4 bg-muted/20 rounded-full"></div>
                    <div className="absolute top-[10%] bottom-[10%] left-[50%] w-4 bg-muted/20 rounded-full"></div>
                    <div className="absolute left-[30%] right-[10%] top-[30%] h-3 bg-muted/20 rounded-full"></div>
                    <div className="absolute left-[10%] right-[30%] top-[70%] h-3 bg-muted/20 rounded-full"></div>
                    <div className="absolute top-[20%] bottom-[20%] left-[25%] w-3 bg-muted/20 rounded-full"></div>
                    <div className="absolute top-[20%] bottom-[20%] left-[75%] w-3 bg-muted/20 rounded-full"></div>
                  </div>
                  
                  {/* Traffic markers */}
                  {filteredMarkers().map((marker) => (
                    <div
                      key={marker.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ 
                        top: marker.position.top,
                        left: marker.position.left,
                      }}
                    >
                      <div className={`flex flex-col items-center group`}>
                        <div className={`${marker.color} text-white rounded-full p-1`}>
                          {marker.type === "trafficLight" ? (
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 bg-background/90 text-foreground text-xs px-2 py-1 rounded mt-1 whitespace-nowrap transition-opacity">
                          {marker.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Map controls */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <Button variant="secondary" size="icon" onClick={handleZoomIn} className="h-8 w-8 rounded-md shadow-md">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={handleZoomOut} className="h-8 w-8 rounded-md shadow-md">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-md shadow-md">
                    <Navigation className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-md shadow-md">
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MapPage;
