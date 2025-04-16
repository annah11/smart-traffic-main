
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrafficCameraFeed } from "@/components/dashboard/TrafficCameraFeed";
import { TrafficLight } from "@/components/dashboard/TrafficLight";
import { TrafficMap } from "@/components/dashboard/TrafficMap";
import { TrafficMetricsChart } from "@/components/dashboard/TrafficMetricsChart";
import { SystemStatusCard } from "@/components/dashboard/SystemStatusCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Car, 
  AlertTriangle, 
  Clock, 
  Activity,
  Camera,
  Gauge
} from "lucide-react";
import { TrafficLightMode, TrafficLightColor, TrafficLight as TrafficLightType } from "@/utils/types";

import { 
  trafficVolumeData, 
  congestionData, 
  trafficCameraData, 
  trafficLightData, 
  systemStatusData 
} from "@/utils/mockData";

const Index = () => {
  const [trafficLights, setTrafficLights] = useState<TrafficLightType[]>(trafficLightData);
  const isMobile = useIsMobile();

  const handleChangeLightMode = (id: string, mode: TrafficLightMode) => {
    setTrafficLights(prev => 
      prev.map(light => 
        light.id === id ? { ...light, mode } : light
      )
    );
  };

  const handleChangeLight = (id: string, currentLight: TrafficLightColor) => {
    setTrafficLights(prev => 
      prev.map(light => 
        light.id === id ? { ...light, currentLight } : light
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <div className={`flex-1 flex flex-col ${isMobile ? "" : "ml-[240px]"} transition-all duration-300`}>
          <DashboardHeader />
          
          <div className="flex-1 p-3 sm:p-6 overflow-auto">
            <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-3 sm:mb-6">
              <StatCard
                title="Total Traffic Volume"
                value="25,429"
                description="vehicles today"
                icon={<Car />}
                trend={{ value: "12%", isPositive: true }}
              />
              <StatCard
                title="Average Congestion"
                value="68%"
                description="across monitored zones"
                icon={<Gauge />}
                trend={{ value: "5%", isPositive: false }}
              />
              <StatCard
                title="Incident Alerts"
                value="7"
                description="in the last 24 hours"
                icon={<AlertTriangle />}
                trend={{ value: "3", isPositive: false }}
              />
              <StatCard
                title="Average Wait Time"
                value="87s"
                description="at major intersections"
                icon={<Clock />}
                trend={{ value: "14s", isPositive: true }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
              <TrafficMap className="md:col-span-2" />
              <SystemStatusCard items={systemStatusData} />
            </div>
            
            <div className="mb-3 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Traffic Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                <TrafficMetricsChart
                  title="Traffic Volume (24 Hours)"
                  type="line"
                  data={trafficVolumeData}
                />
                <TrafficMetricsChart
                  title="Congestion by Location"
                  type="bar"
                  data={congestionData}
                />
              </div>
            </div>
            
            <div className="mb-3 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Live Camera Feeds</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {trafficCameraData.map((camera) => (
                  <TrafficCameraFeed
                    key={camera.id}
                    {...camera}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-3 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Traffic Light Control</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {trafficLights.map((light) => (
                  <TrafficLight
                    key={light.id}
                    {...light}
                    onChangeMode={handleChangeLightMode}
                    onChangeLight={handleChangeLight}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
