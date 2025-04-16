
import { TrafficLight, TrafficCamera, SystemStatusItem } from "./types";

// Mock data for the traffic management system

// Traffic metrics over time
export const trafficVolumeData = [
  { name: "00:00", value: 150, average: 180 },
  { name: "01:00", value: 120, average: 140 },
  { name: "02:00", value: 90, average: 110 },
  { name: "03:00", value: 70, average: 80 },
  { name: "04:00", value: 110, average: 100 },
  { name: "05:00", value: 180, average: 170 },
  { name: "06:00", value: 320, average: 300 },
  { name: "07:00", value: 580, average: 500 },
  { name: "08:00", value: 620, average: 580 },
  { name: "09:00", value: 500, average: 550 },
  { name: "10:00", value: 470, average: 480 },
  { name: "11:00", value: 450, average: 460 },
  { name: "12:00", value: 480, average: 470 },
  { name: "13:00", value: 510, average: 490 },
  { name: "14:00", value: 490, average: 500 },
  { name: "15:00", value: 520, average: 510 },
  { name: "16:00", value: 570, average: 550 },
  { name: "17:00", value: 610, average: 590 },
  { name: "18:00", value: 590, average: 580 },
  { name: "19:00", value: 480, average: 500 },
  { name: "20:00", value: 410, average: 400 },
  { name: "21:00", value: 350, average: 360 },
  { name: "22:00", value: 280, average: 270 },
  { name: "23:00", value: 210, average: 220 },
];

export const congestionData = [
  { name: "Main St", value: 85 },
  { name: "Broadway", value: 65 },
  { name: "5th Ave", value: 45 },
  { name: "Park Rd", value: 30 },
  { name: "West Blvd", value: 75 },
  { name: "Central Ave", value: 60 },
];

export const trafficCameraData = [
  {
    id: "cam-001",
    title: "Main & 5th Intersection",
    location: "Downtown",
    status: "active" as const,
    imgUrl: "https://images.unsplash.com/photo-1664227879981-1359be8c6b73?q=80&w=2664&auto=format&fit=crop",
    vehicleCount: 45,
    congestionLevel: "high" as const,
  },
  {
    id: "cam-002",
    title: "Highway 101 North",
    location: "North Entrance",
    status: "active" as const,
    imgUrl: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2664&auto=format&fit=crop",
    vehicleCount: 32,
    congestionLevel: "medium" as const,
  },
  {
    id: "cam-003",
    title: "West Bridge",
    location: "River Crossing",
    status: "warning" as const,
    imgUrl: "https://images.unsplash.com/photo-1505433178243-53d00a7b0f86?q=80&w=2663&auto=format&fit=crop",
    vehicleCount: 18,
    congestionLevel: "low" as const,
  },
  {
    id: "cam-004",
    title: "Shopping Center Exit",
    location: "Mall Area",
    status: "error" as const,
    imgUrl: "https://images.unsplash.com/photo-1506835676612-56664061aa9d?q=80&w=2664&auto=format&fit=crop",
  },
];

export const trafficLightData = [
  {
    id: "tl-001",
    name: "Main & 5th",
    location: "Downtown",
    mode: "auto" as const,
    status: "online" as const,
    currentLight: "red" as const,
    timeLeft: 20,
  },
  {
    id: "tl-002",
    name: "Broadway & Park",
    location: "City Center",
    mode: "manual" as const,
    status: "online" as const,
    currentLight: "green" as const,
  },
  {
    id: "tl-003",
    name: "Highway 101 Exit",
    location: "North Entrance",
    mode: "emergency" as const,
    status: "online" as const,
    currentLight: "red" as const,
  },
  {
    id: "tl-004",
    name: "Industrial Zone",
    location: "East District",
    mode: "auto" as const,
    status: "maintenance" as const,
    currentLight: "red" as const,
  },
];

export const systemStatusData: SystemStatusItem[] = [
  {
    name: "Edge Computing Server",
    status: "operational",
    uptime: "98.5%",
    load: 42,
  },
  {
    name: "Camera Network",
    status: "operational",
    uptime: "99.2%",
    load: 67,
  },
  {
    name: "Traffic Signals",
    status: "degraded",
    uptime: "95.8%",
    load: 78,
  },
  {
    name: "Analytics Engine",
    status: "operational",
    uptime: "99.9%",
    load: 35,
  },
  {
    name: "IoT Gateway",
    status: "outage",
    uptime: "89.6%",
    load: 0,
  },
];
