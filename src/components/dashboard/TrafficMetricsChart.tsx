
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface TrafficMetricsChartProps {
  title: string;
  type: "line" | "bar";
  data: Array<Record<string, any>>;
  className?: string;
  aspectRatio?: number;
}

export function TrafficMetricsChart({
  title,
  type,
  data,
  className,
  aspectRatio = 2
}: TrafficMetricsChartProps) {
  const isMobile = useIsMobile();
  
  // Limit data points on mobile to avoid crowding
  const displayData = isMobile && data.length > 8 
    ? data.filter((_, index) => index % 2 === 0) 
    : data;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-traffic-blue/10 text-traffic-blue border-traffic-blue/20 text-[10px] sm:text-xs">
            Last 24 Hours
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-1 sm:p-3">
        <div style={{ width: "100%", height: "100%", aspectRatio: isMobile ? 1.2 : aspectRatio }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart
                data={displayData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={isMobile ? 0.5 : 0.8} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={isMobile ? 8 : 10}
                  tickLine={false}
                  axisLine={false}
                  tick={isMobile ? { fontSize: 8 } : { fontSize: 10 }}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={isMobile ? 8 : 10}
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 15 : 20}
                  tick={isMobile ? { fontSize: 8 } : { fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: isMobile ? "10px" : "12px",
                    padding: isMobile ? "4px" : "8px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890FF"
                  strokeWidth={isMobile ? 1.5 : 2}
                  dot={false}
                  activeDot={{ r: isMobile ? 3 : 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#13C2C2"
                  strokeWidth={isMobile ? 1.5 : 2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart
                data={displayData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                barGap={isMobile ? 1 : 3}
                barSize={isMobile ? 10 : undefined}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={isMobile ? 0.5 : 0.8} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={isMobile ? 8 : 10}
                  tickLine={false}
                  axisLine={false}
                  tick={isMobile ? { fontSize: 8 } : { fontSize: 10 }}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={isMobile ? 8 : 10}
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 15 : 20}
                  tick={isMobile ? { fontSize: 8 } : { fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: isMobile ? "10px" : "12px",
                    padding: isMobile ? "4px" : "8px"
                  }}
                />
                <Bar dataKey="value" fill="#1890FF" radius={[3, 3, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
