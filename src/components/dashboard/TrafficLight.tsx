import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Correct import
import { cn } from "@/lib/utils";
import { Settings, Clock } from "lucide-react";
import { TrafficLightMode, TrafficLightColor, TrafficLightStatus, type TrafficLight } from "@/utils/types"; // Adjust path
import { getTrafficLightData, updateTrafficLightMode, updateTrafficLightLight, updateTrafficLightTimeLeft } from "@/lib/trafficLightData"; // Adjust path

interface TrafficLightProps {
  id: string;
  className?: string;
}

export function TrafficLight({
  id,
  className,
}: TrafficLightProps) {
  const [trafficLightData, setTrafficLightData] = useState<TrafficLight | null>(null);
  const [localTimeLeft, setLocalTimeLeft] = useState(0); // Initialize with 0

  useEffect(() => {
    getTrafficLightData(id, (data) => {
      setTrafficLightData(data);
      setLocalTimeLeft(data?.timeLeft || 0); // Initialize localTimeLeft
    });

    // Cleanup function (optional, but good practice)
    return () => {
      // Any cleanup logic here (e.g., unsubscribe from Firebase)
    };
  }, [id]);

  useEffect(() => {
    if (!trafficLightData) return;

    const { mode, status, currentLight } = trafficLightData;

    if (mode === "auto" && status === "online" && localTimeLeft > 0) {
      const timer = setInterval(() => {
        setLocalTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto change light when timer reaches zero
            const nextLight =
              currentLight === "red" ? "green" :
              currentLight === "green" ? "yellow" : "red";

            updateTrafficLightLight(id, nextLight).then(() => {
              // Reset timer based on next light (after Firebase update)
              const newTimeLeft = nextLight === "red" ? 30 : nextLight === "green" ? 25 : 5;
              updateTrafficLightTimeLeft(id, newTimeLeft); // Update timeLeft in Firebase
            });

            return prev; // Keep the same value until Firebase updates
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [trafficLightData, localTimeLeft, id]);

  // Update local time when trafficLightData.timeLeft changes
  useEffect(() => {
    if (trafficLightData && trafficLightData.timeLeft !== undefined) {
      setLocalTimeLeft(trafficLightData.timeLeft);
    }
  }, [trafficLightData?.timeLeft]);

  const handleModeChange = (mode: TrafficLightMode) => {
    updateTrafficLightMode(id, mode);
  };

  const handleLightChange = (light: TrafficLightColor) => {
    updateTrafficLightLight(id, light);
  };

  if (!trafficLightData) {
    return <div>Loading...</div>;
  }

  const { name, location, mode, status, currentLight } = trafficLightData;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "px-2 py-0",
            {
              "bg-traffic-green/10 text-traffic-green border-traffic-green/20": status === "online",
              "bg-traffic-amber/10 text-traffic-amber border-traffic-amber/20": status === "maintenance",
              "bg-traffic-red/10 text-traffic-red border-traffic-red/20": status === "offline",
            }
          )}
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gray-800 p-2 rounded-lg flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-full mb-1",
              {
                "bg-traffic-red animate-pulse-red": currentLight === "red",
                "bg-gray-700": currentLight !== "red"
              }
            )} />
            <div className={cn(
              "w-10 h-10 rounded-full mb-1",
              {
                "bg-traffic-amber animate-pulse-amber": currentLight === "yellow",
                "bg-gray-700": currentLight !== "yellow"
              }
            )} />
            <div className={cn(
              "w-10 h-10 rounded-full",
              {
                "bg-traffic-green animate-pulse-green": currentLight === "green",
                "bg-gray-700": currentLight !== "green"
              }
            )} />
          </div>

          {mode === "auto" && status === "online" && (
            <div className="ml-4 flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-xs">{localTimeLeft}s</span>
              </div>
              <div className="bg-muted h-16 w-3 rounded overflow-hidden">
                <div
                  className={cn(
                    "w-full transition-all duration-1000",
                    currentLight === "red" ? "bg-traffic-red" :
                    currentLight === "yellow" ? "bg-traffic-amber" :
                    "bg-traffic-green"
                  )}
                  style={{
                    height: `${(localTimeLeft / (currentLight === "red" ? 30 : currentLight === "green" ? 25 : 5)) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-1 mt-3">
          <Button
            variant={mode === "auto" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => handleModeChange("auto")}
            disabled={status !== "online"}
          >
            Auto
          </Button>
          <Button
            variant={mode === "manual" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => handleModeChange("manual")}
            disabled={status !== "online"}
          >
            Manual
          </Button>
          <Button
            variant={mode === "emergency" ? "destructive" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => handleModeChange("emergency")}
            disabled={status !== "online"}
          >
            Emergency
          </Button>
        </div>

        {mode === "manual" && status === "online" && (
          <div className="flex justify-between gap-1 mt-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-red/20 border-traffic-red/30 text-traffic-red": currentLight === "red"
              })}
              onClick={() => handleLightChange("red")}
            >
              Red
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-amber/20 border-traffic-amber/30 text-traffic-amber": currentLight === "yellow"
              })}
              onClick={() => handleLightChange("yellow")}
            >
              Yellow
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-green/20 border-traffic-green/30 text-traffic-green": currentLight === "green"
              })}
              onClick={() => handleLightChange("green")}
            >
              Green
            </Button>
          </div>
        )}

        {mode === "emergency" && status === "online" && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-center">
            Emergency mode active. Traffic light is set to blinking red.
          </div>
        )}

        {status !== "online" && (
          <div className="mt-2 p-2 bg-muted border border-border rounded text-xs text-center flex items-center justify-center">
            <Settings className="h-3 w-3 mr-1" />
            {status === "maintenance" ? "Under maintenance" : "Device offline"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}