
// Type definitions for the traffic management system components

export type TrafficLightMode = "auto" | "manual" | "emergency";
export type TrafficLightStatus = "online" | "offline" | "maintenance";
export type TrafficLightColor = "red" | "yellow" | "green";
export type CameraStatus = "active" | "warning" | "error";
export type CongestionLevel = "low" | "medium" | "high";
export type SystemComponentStatus = "operational" | "degraded" | "outage";

export interface TrafficLight {
  id: string;
  name: string;
  location: string;
  mode: TrafficLightMode;
  status: TrafficLightStatus;
  currentLight: TrafficLightColor;
  timeLeft?: number;
}

export interface TrafficCamera {
  id: string;
  title: string;
  location: string;
  status: CameraStatus;
  imgUrl: string;
  vehicleCount?: number;
  congestionLevel?: CongestionLevel;
}

export interface SystemStatusItem {
  name: string;
  status: SystemComponentStatus;
  uptime?: string;
  load?: number;
}
