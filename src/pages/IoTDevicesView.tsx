import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, WifiOff, AlertCircle, ArrowLeft, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface IoTDevice {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  lastSeen: string;
}

const statusColor = {
  online: "text-green-400",
  offline: "text-red-500",
  warning: "text-yellow-400",
};

const IoTDevicesView: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date().toLocaleTimeString();
    setLastUpdated(now);

    setTimeout(() => {
      setDevices([
        {
          id: "dev-001",
          name: "Traffic Sensor A1",
          location: "Bole Main Road",
          status: "online",
          lastSeen: "Just now",
        },
        {
          id: "dev-002",
          name: "Speed Monitor B3",
          location: "Meskel Square",
          status: "warning",
          lastSeen: "5 mins ago",
        },
        {
          id: "dev-003",
          name: "Env Monitor C5",
          location: "Churchill Avenue",
          status: "offline",
          lastSeen: "2 hours ago",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewLogs = (device: IoTDevice) => {
    navigate(`/logs/${device.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">IoT Device Monitoring</h1>
          <p className="text-muted-foreground text-base">
            Track the health and connection of active IoT devices.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-base flex items-center bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Last updated: {lastUpdated}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-base text-muted-foreground">Loading devices...</p>
        ) : (
          devices.map((device) => (
            <Card
              key={device.id}
              className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-600"
            >
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {device.status === "online" && <Cpu className="text-green-400 w-5 h-5" />}
                    {device.status === "offline" && <WifiOff className="text-red-500 w-5 h-5" />}
                    {device.status === "warning" && <AlertCircle className="text-yellow-400 w-5 h-5" />}
                    <h3 className="font-semibold text-white text-lg">{device.name}</h3>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full",
                      {
                        "bg-green-900 text-green-300": device.status === "online",
                        "bg-red-900 text-red-400": device.status === "offline",
                        "bg-yellow-900 text-yellow-400": device.status === "warning",
                      }
                    )}
                  >
                    {device.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Location:</strong> {device.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Last seen:</strong> {device.lastSeen}
                </p>
                <button
                  onClick={() => handleViewLogs(device)}
                  className="mt-2 text-sm bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-white w-fit self-start flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" /> View Logs
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default IoTDevicesView;
