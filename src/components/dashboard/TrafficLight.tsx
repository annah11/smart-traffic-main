
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Settings, Clock } from "lucide-react";
import { TrafficLightMode, TrafficLightColor, TrafficLightStatus } from "@/utils/types";

interface TrafficLightProps {
  id: string;
  name: string;
  location: string;
  mode: TrafficLightMode;
  status: TrafficLightStatus;
  currentLight: TrafficLightColor;
  timeLeft?: number;
  className?: string;
  onChangeMode?: (id: string, mode: TrafficLightMode) => void;
  onChangeLight?: (id: string, light: TrafficLightColor) => void;
}

export function TrafficLight({
  id,
  name,
  location,
  mode,
  status,
  currentLight,
  timeLeft,
  className,
  onChangeMode,
  onChangeLight
}: TrafficLightProps) {
  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft || 0);

  useEffect(() => {
    if (mode === "auto" && status === "online" && localTimeLeft > 0) {
      const timer = setInterval(() => {
        setLocalTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto change light when timer reaches zero
            const nextLight = 
              currentLight === "red" ? "green" : 
              currentLight === "green" ? "yellow" : "red";
            
            onChangeLight && onChangeLight(id, nextLight);
            
            // Reset timer based on next light
            return nextLight === "red" ? 30 : nextLight === "green" ? 25 : 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentLight, mode, status, localTimeLeft, id, onChangeLight]);

  // Update local time when prop changes
  useEffect(() => {
    if (timeLeft !== undefined) {
      setLocalTimeLeft(timeLeft);
    }
  }, [timeLeft]);

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
            onClick={() => onChangeMode && onChangeMode(id, "auto")}
            disabled={status !== "online"}
          >
            Auto
          </Button>
          <Button 
            variant={mode === "manual" ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => onChangeMode && onChangeMode(id, "manual")}
            disabled={status !== "online"}
          >
            Manual
          </Button>
          <Button 
            variant={mode === "emergency" ? "destructive" : "outline"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => onChangeMode && onChangeMode(id, "emergency")}
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
              onClick={() => onChangeLight && onChangeLight(id, "red")}
            >
              Red
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-amber/20 border-traffic-amber/30 text-traffic-amber": currentLight === "yellow"
              })}
              onClick={() => onChangeLight && onChangeLight(id, "yellow")}
            >
              Yellow
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className={cn("flex-1 text-xs h-7", {
                "bg-traffic-green/20 border-traffic-green/30 text-traffic-green": currentLight === "green"
              })}
              onClick={() => onChangeLight && onChangeLight(id, "green")}
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
