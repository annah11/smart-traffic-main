import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrafficLightColor = "red" | "yellow" | "green";

export interface TrafficLightProps {
  id: string;
  name: string;
  location: string;
  mode?: "auto" | "manual" | "emergency";
  status?: "online" | "offline" | "maintenance";
  currentLight?: TrafficLightColor;
  timeLeft?: number;
  className?: string;
  onChangeMode?: (id: string, mode: "auto" | "manual" | "emergency") => void;
  onChangeLight?: (id: string, light: TrafficLightColor) => void;
}

export function TrafficLight({
  id,
  name,
  location,
  mode = "auto",
  status = "online",
  currentLight = "red",
  timeLeft,
  className,
  onChangeMode,
  onChangeLight,
}: TrafficLightProps) {
  const [localMode, setLocalMode] = useState<"auto" | "manual" | "emergency">(mode);
  const [localStatus, setLocalStatus] = useState<"online" | "offline" | "maintenance">(status);
  const [localCurrentLight, setLocalCurrentLight] = useState<TrafficLightColor>(currentLight);
  const [localTimeLeft, setLocalTimeLeft] = useState<number>(
    timeLeft ??
      (currentLight === "red" ? 30 : currentLight === "green" ? 25 : 5)
  );

  // Auto-cycle timer
  useEffect(() => {
    if (localMode !== "auto" || localStatus !== "online") return;

    const timer = setInterval(() => {
      setLocalTimeLeft((prev) => {
        if (prev <= 1) {
          const nextLight =
            localCurrentLight === "red"
              ? "green"
              : localCurrentLight === "green"
              ? "yellow"
              : "red";

          setLocalCurrentLight(nextLight);
          onChangeLight?.(id, nextLight);

          return nextLight === "red" ? 30 : nextLight === "green" ? 25 : 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [localMode, localStatus, id, localCurrentLight, onChangeLight]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <Badge
          variant="outline"
          className={cn("px-2 py-0", {
            "bg-traffic-green/10 text-traffic-green border-traffic-green/20": localStatus === "online",
            "bg-traffic-amber/10 text-traffic-amber border-traffic-amber/20": localStatus === "maintenance",
            "bg-traffic-red/10 text-traffic-red border-traffic-red/20": localStatus === "offline",
          })}
        >
          {localStatus}
        </Badge>
      </CardHeader>

      <CardContent className="p-3">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gray-800 p-2 rounded-lg flex flex-col items-center">
            <div className={cn("w-10 h-10 rounded-full mb-1", localCurrentLight === "red" ? "bg-traffic-red animate-pulse-red" : "bg-gray-700")} />
            <div className={cn("w-10 h-10 rounded-full mb-1", localCurrentLight === "yellow" ? "bg-traffic-amber animate-pulse-amber" : "bg-gray-700")} />
            <div className={cn("w-10 h-10 rounded-full", localCurrentLight === "green" ? "bg-traffic-green animate-pulse-green" : "bg-gray-700")} />
          </div>

          {localMode === "auto" && localStatus === "online" && (
            <div className="ml-4 flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-xs">{localTimeLeft}s</span>
              </div>
              <div className="bg-muted h-16 w-3 rounded overflow-hidden">
                <div
                  className={cn("w-full transition-all duration-1000", {
                    "bg-traffic-red": localCurrentLight === "red",
                    "bg-traffic-amber": localCurrentLight === "yellow",
                    "bg-traffic-green": localCurrentLight === "green",
                  })}
                  style={{
                    height: `${
                      (localTimeLeft /
                        (localCurrentLight === "red"
                          ? 30
                          : localCurrentLight === "green"
                          ? 25
                          : 5)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-1 mt-3">
          <Button
            variant={localMode === "auto" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => {
              setLocalMode("auto");
              onChangeMode?.(id, "auto");
            }}
            disabled={localStatus !== "online"}
          >
            Auto
          </Button>
          <Button
            variant={localMode === "manual" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => {
              setLocalMode("manual");
              onChangeMode?.(id, "manual");
            }}
            disabled={localStatus !== "online"}
          >
            Manual
          </Button>
          <Button
            variant={localMode === "emergency" ? "destructive" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => {
              setLocalMode("emergency");
              onChangeMode?.(id, "emergency");
            }}
            disabled={localStatus !== "online"}
          >
            Emergency
          </Button>
        </div>

        {localMode === "manual" && localStatus === "online" && (
          <div className="flex justify-between gap-1 mt-2">
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-red/20 border-traffic-red/30 text-traffic-red": localCurrentLight === "red",
              })}
              onClick={() => {
                setLocalCurrentLight("red");
                onChangeLight?.(id, "red");
              }}
            >
              Red
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-amber/20 border-traffic-amber/30 text-traffic-amber": localCurrentLight === "yellow",
              })}
              onClick={() => {
                setLocalCurrentLight("yellow");
                onChangeLight?.(id, "yellow");
              }}
            >
              Yellow
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-green/20 border-traffic-green/30 text-traffic-green": localCurrentLight === "green",
              })}
              onClick={() => {
                setLocalCurrentLight("green");
                onChangeLight?.(id, "green");
              }}
            >
              Green
            </Button>
          </div>
        )}

        {localMode === "emergency" && localStatus === "online" && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-center">
            Emergency mode active. Traffic light is set to blinking red.
          </div>
        )}

        {localStatus !== "online" && (
          <div className="mt-2 p-2 bg-muted border border-border rounded text-xs text-center flex items-center justify-center">
            <Settings className="h-3 w-3 mr-1" />
            {localStatus === "maintenance" ? "Under maintenance" : "Device offline"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
