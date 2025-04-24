
import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface TrafficMapProps {
  className?: string;
}

export function TrafficMap({ className }: TrafficMapProps) {
  const isMobile = useIsMobile();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Update with the provided Mapbox token
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFubml0aSIsImEiOiJjbTl1YnRjNnUwNzV1MnFzNjQzcGNweWM5In0.pbabLzUCTjQIyBneR3Xxuw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [38.7578, 9.0252], // Addis Ababa coordinates
      zoom: 12,
      pitch: 45,
    });

    // Add navigation control
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add traffic markers
    const addMarker = (lat: number, lng: number, color: string) => {
      const marker = document.createElement('div');
      marker.className = `${color} text-white rounded-full p-1`;
      
      const icon = document.createElement('div');
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
      marker.appendChild(icon);

      new mapboxgl.Marker({ element: marker })
        .setLngLat([lng, lat])
        .addTo(map.current!);
    };

    // Add sample markers for different traffic conditions
    addMarker(9.0252, 38.7578, 'bg-traffic-red'); // Meskel Square
    addMarker(9.0300, 38.7900, 'bg-traffic-amber'); // Bole Road
    addMarker(9.0150, 38.7400, 'bg-traffic-green'); // Churchill Avenue

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">Addis Ababa Traffic Map</CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className="relative h-full w-full min-h-[180px] sm:min-h-[300px] bg-sidebar-accent rounded overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0" />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 p-2 rounded-lg shadow-lg text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-traffic-red text-white rounded-full p-0.5">
                <MapPin className="h-3 w-3" />
              </div>
              <span>Heavy Traffic</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-traffic-amber text-white rounded-full p-0.5">
                <MapPin className="h-3 w-3" />
              </div>
              <span>Moderate Traffic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-traffic-green text-white rounded-full p-0.5">
                <MapPin className="h-3 w-3" />
              </div>
              <span>Light Traffic</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
