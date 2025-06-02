// src/pages/SystemStatusView.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Wifi,
  AlertCircle,
  Server,
  Eye,
  TrafficCone,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusItem {
  label: string;
  value: string;
  icon: JSX.Element;
  status?: "ok" | "warning" | "error";
}

const statusColors = {
  ok: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-500",
};

const SystemStatusView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<StatusItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setStatusData([
        {
          label: "Total Devices Online",
          value: "122 / 126",
          icon: <Wifi className="w-5 h-5" />,
          status: "ok",
        },
        {
          label: "Camera Streams Active",
          value: "18 / 20",
          icon: <Eye className="w-5 h-5" />,
          status: "warning",
        },
        {
          label: "Server Uptime",
          value: "99.97%",
          icon: <Server className="w-5 h-5" />,
          status: "ok",
        },
        {
          label: "Traffic Node Errors",
          value: "2 Critical",
          icon: <TrafficCone className="w-5 h-5" />,
          status: "error",
        },
        {
          label: "Last Sync",
          value: "2 minutes ago",
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          status: "ok",
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">System Status Overview</h1>
        <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading system data...</p>
        ) : (
          statusData.map((item, i) => (
            <Card key={i} className="bg-card shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={cn("p-3 rounded-full bg-muted", statusColors[item.status ?? "ok"])}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemStatusView;
