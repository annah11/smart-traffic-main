import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  location: string;
  status: "new" | "acknowledged" | "resolved";
}

const AlertsView = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "error",
      title: "Traffic Light Malfunction",
      message: "Traffic light at Meskel Square intersection is not responding",
      timestamp: new Date(),
      location: "Meskel Square & Bole, Addis Ababa",
      status: "new"
    },
    {
      id: "2",
      type: "warning",
      title: "High Traffic Volume",
      message: "Unusual traffic congestion detected",
      timestamp: new Date(Date.now() - 3600000),
      location: "Bole Road Exit, Addis Ababa",
      status: "acknowledged"
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Maintenance",
      message: "Gotera Roundabout traffic lights under maintenance",
      timestamp: new Date(Date.now() - 7200000),
      location: "Gotera Roundabout",
      status: "acknowledged"
    },
    {
      id: "4",
      type: "success",
      title: "Incident Resolved",
      message: "Piassa Junction congestion cleared",
      timestamp: new Date(Date.now() - 86400000),
      location: "Piassa Junction",
      status: "resolved"
    }
  ]);

  const handleAlertAction = (alertId: string, action: "acknowledge" | "resolve") => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action === "acknowledge" ? "acknowledged" : "resolved" }
          : alert
      )
    );
    
    toast.success(`Alert ${action}d successfully`);
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error": return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info": return <Info className="h-5 w-5 text-blue-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusBadge = (status: Alert["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">New</Badge>;
      case "acknowledged":
        return <Badge variant="outline">Acknowledged</Badge>;
      case "resolved":
        return <Badge variant="secondary">Resolved</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Alert Management
              </h1>
              <p className="text-muted-foreground">Monitor and manage system alerts</p>
            </div>

            <div className="space-y-4">
              {alerts.map(alert => (
                <Card key={alert.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                      </div>
                      {getStatusBadge(alert.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Location: {alert.location}</p>
                        <p className="text-muted-foreground">
                          Time: {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        {alert.status === "new" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, "acknowledge")}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {alert.status !== "resolved" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, "resolve")}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AlertsView;