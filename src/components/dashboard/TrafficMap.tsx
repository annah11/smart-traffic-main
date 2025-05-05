
import React, { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TrafficMapProps {
  className?: string;
}

interface TrafficPoint {
  location: string;
  coordinates: [number, number];
  congestion: 'high' | 'medium' | 'low';
  vehicleCount: number;
  avgSpeed: number;
}

const trafficData: TrafficPoint[] = [
  {
    location: "Meskel Square",
    coordinates: [38.7578, 9.0252],
    congestion: 'high',
    vehicleCount: 145,
    avgSpeed: 15,
  },
  {
    location: "Bole Road",
    coordinates: [38.7900, 9.0300],
    congestion: 'medium',
    vehicleCount: 89,
    avgSpeed: 35,
  },
  {
    location: "Churchill Avenue",
    coordinates: [38.7400, 9.0150],
    congestion: 'low',
    vehicleCount: 42,
    avgSpeed: 50,
  },
  {
    location: "Sidist Kilo",
    coordinates: [38.7634, 9.0378],
    congestion: 'high',
    vehicleCount: 167,
    avgSpeed: 12,
  },
  {
    location: "Piazza",
    coordinates: [38.7492, 9.0346],
    congestion: 'medium',
    vehicleCount: 93,
    avgSpeed: 28,
  }
];

export function TrafficMap({ className }: TrafficMapProps) {
  const isMobile = useIsMobile();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFubml0aSIsImEiOiJjbTl1YnRjNnUwNzV1MnFzNjQzcGNweWM5In0.pbabLzUCTjQIyBneR3Xxuw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [38.7578, 9.0252],
      zoom: 13,
      pitch: 45,
    });

    // Add navigation control
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    map.current.on('load', () => {
      // Add traffic markers with popups
      trafficData.forEach((point) => {
        // Create custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = cn(
          'rounded-full p-2 cursor-pointer transition-all duration-300 hover:scale-110',
          {
            'bg-traffic-red': point.congestion === 'high',
            'bg-traffic-amber': point.congestion === 'medium',
            'bg-traffic-green': point.congestion === 'low',
          }
        );
        
        const icon = document.createElement('div');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        markerEl.appendChild(icon);

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-bold mb-2">${point.location}</h3>
            <div class="text-sm space-y-1">
              <p>Traffic Level: <span class="font-medium">${point.congestion}</span></p>
              <p>Vehicles: <span class="font-medium">${point.vehicleCount}</span></p>
              <p>Avg Speed: <span class="font-medium">${point.avgSpeed} km/h</span></p>
            </div>
          </div>
        `);

        // Add marker with popup
        new mapboxgl.Marker({ element: markerEl })
          .setLngLat(point.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        // Add traffic flow lines between points
        if (map.current) {
          map.current.addSource(`route-${point.location}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  point.coordinates,
                  [point.coordinates[0] + 0.01, point.coordinates[1] + 0.01]
                ]
              }
            }
          });

          map.current.addLayer({
            id: `route-${point.location}`,
            type: 'line',
            source: `route-${point.location}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': point.congestion === 'high' ? '#ef4444' : 
                           point.congestion === 'medium' ? '#f59e0b' : '#22c55e',
              'line-width': 3,
              'line-opacity': 0.7
            }
          });
        }
      });
    });

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
              <span>Heavy Traffic (0-20 km/h)</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-traffic-amber text-white rounded-full p-0.5">
                <MapPin className="h-3 w-3" />
              </div>
              <span>Moderate Traffic (20-40 km/h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-traffic-green text-white rounded-full p-0.5">
                <MapPin className="h-3 w-3" />
              </div>
              <span>Light Traffic (40+ km/h)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
