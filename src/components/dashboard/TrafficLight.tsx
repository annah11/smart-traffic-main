// src/components/dashboard/TrafficLight.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Settings, Clock } from "lucide-react";
import {
  TrafficLightMode,
  TrafficLightColor,
  TrafficLightStatus,
  type TrafficLight as TrafficLightType
} from "@/utils/types";

export interface TrafficLightProps {
  id: string;
  name: string;
  location: string;
  currentLight: TrafficLightColor;
  mode: TrafficLightMode;
  status: TrafficLightStatus;
  timeLeft: number;
  onChangeMode: (mode: TrafficLightMode) => void;
  onChangeLight: (color: TrafficLightColor) => void;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({
  id,
  name,
  location,
  currentLight,
  mode,
  status,
  timeLeft,
  onChangeMode,
  onChangeLight,
}) => {
  return (
    <Card className={cn("overflow-hidden", "cursor-pointer")}>
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "px-2 py-0 text-[10px] sm:text-xs",
            status === "online" && "bg-traffic-green/10 text-traffic-green border-traffic-green/20",
            status === "maintenance" && "bg-traffic-amber/10 text-traffic-amber border-traffic-amber/20",
            status === "offline" && "bg-traffic-red/10 text-traffic-red border-traffic-red/20"
          )}
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gray-800 p-2 rounded-lg flex flex-col items-center">
            {(["red", "yellow", "green"] as TrafficLightColor[]).map((color) => (
              <div
                key={color}
                className={cn(
                  "w-10 h-10 rounded-full mb-1",
                  currentLight === color
                    ? color === "red"
                      ? "bg-traffic-red animate-pulse-red"
                      : color === "yellow"
                      ? "bg-traffic-amber animate-pulse-amber"
                      : "bg-traffic-green animate-pulse-green"
                    : "bg-gray-700"
                )}
              />
            ))}
          </div>
          {mode === "auto" && status === "online" && (
            <div className="ml-4 flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Clock className="h-3 w-3 mr-1" />
                <span className="text-xs">{timeLeft}s</span>
              </div>
              <div className="bg-muted h-16 w-3 rounded overflow-hidden">
                <div
                  className={cn(
                    "w-full transition-all duration-1000",
                    currentLight === "red"
                      ? "bg-traffic-red"
                      : currentLight === "yellow"
                      ? "bg-traffic-amber"
                      : "bg-traffic-green"
                  )}
                  style={{
                    height: `${(timeLeft /
                      (currentLight === "red" ? 30 : currentLight === "green" ? 25 : 5)) *
                      100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-1 mt-3">
          {(["auto", "manual", "emergency"] as TrafficLightMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? (m === "emergency" ? "destructive" : "default") : "outline"}
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => onChangeMode(m)}
              disabled={status !== "online"}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </Button>
          ))}
        </div>
        {mode === "manual" && status === "online" && (
          <div className="flex justify-between gap-1 mt-2">
            {(["red", "yellow", "green"] as TrafficLightColor[]).map((color) => (
              <Button
                key={color}
                variant="outline"
                size="sm"
                className={cn("flex-1 text-xs h-7", {
                  [`bg-traffic-${color}/20 border-traffic-${color}/30 text-traffic-${color}`]:
                    currentLight === color,
                })}
                onClick={() => onChangeLight(color)}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </Button>
            ))}
          </div>
        )}
        {mode === "emergency" && status === "online" && (
          <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-center">
            Emergency mode active. Traffic light is blinking red.
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
};
