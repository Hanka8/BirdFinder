import { useRef, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon, Map as LeafletMap } from "leaflet";
import BirdPopup from "./BirdPopup";
import { InteractiveMapProps } from "../types";
import { radius } from "../constants";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
import markerIcon from "../assets/map-pin.svg";
import birdIcon from "../assets/bird-ico.svg";

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconSize: [35, 41],
});

const customBirdIcon = new Icon({
  iconUrl: birdIcon,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const MapEvents: React.FC<{
  setLatitude: (lat: string) => void;
  setLongitude: (lng: string) => void;
  shouldUpdateCenter: React.MutableRefObject<boolean>;
}> = ({ setLatitude, setLongitude, shouldUpdateCenter }) => {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const latStr = lat.toFixed(2);
      const lngStr = lng.toFixed(2);

      shouldUpdateCenter.current = false;
      setLatitude(latStr);
      setLongitude(lngStr);

      navigate({
        to: `/location/${latStr}/${lngStr}`,
        params: {
          latitude: latStr,
          longitude: lngStr,
        },
      });
    },
  });

  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  data,
  wikiDataMap: wikiResults,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldUpdateCenter = useRef<boolean>(true);
  const position = useMemo(
    (): [number, number] => [
      parseFloat(latitude || "0"),
      parseFloat(longitude || "0"),
    ],
    [latitude, longitude]
  );

  // Add resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        if (shouldUpdateCenter.current) {
          mapRef.current.setView(position, 12);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [position]);

  // Existing useEffect for position changes
  useEffect(() => {
    if (mapRef.current && shouldUpdateCenter.current) {
      mapRef.current.invalidateSize();
      mapRef.current.setView(position, 12);
    }
    shouldUpdateCenter.current = true; // Reset for next update
  }, [position]);

  if (!latitude || !longitude) return null;

  return (
    <div className="w-full md:w-1/2 md:ml-auto">
      <div
        ref={containerRef}
        className="w-full h-50vh md:h-screen md:fixed md:right-0 md:top-136 md:w-1/2"
      >
        <MapContainer
          center={position}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapEvents
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            shouldUpdateCenter={shouldUpdateCenter}
          />

          {/* Main marker for selected location */}
          <Marker position={position} icon={defaultIcon} />

          {/* Circle for radius */}
          <Circle
            center={position}
            radius={radius * 1000}
            pathOptions={{
              color: "rgba(0, 128, 0, 0.8)",
              fillColor: "rgba(0, 255, 0)",
              fillOpacity: 0.1,
            }}
          />

          {/* Bird markers */}
          {data
            ?.reduce(
              (markers, bird, index) => {
                // Find existing marker at this position
                const existingMarkerIndex = markers.findIndex(
                  (marker) =>
                    marker.position[0] === bird.lat &&
                    marker.position[1] === bird.lng
                );

                if (existingMarkerIndex !== -1) {
                  // Add bird to existing marker's birds array
                  markers[existingMarkerIndex].birds.push(bird);
                  return markers;
                } else {
                  // Create new marker with birds array
                  markers.push({
                    position: [bird.lat, bird.lng],
                    birds: [bird],
                    key: `marker-${index}`,
                  });
                  return markers;
                }
              },
              [] as Array<{
                position: [number, number];
                birds: (typeof data)[0][];
                key: string;
              }>
            )
            .map((marker) => (
              <Marker
                key={marker.key}
                position={marker.position}
                icon={customBirdIcon}
              >
                <Popup>
                  <BirdPopup birds={marker.birds} wikiDataMap={wikiResults} />
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;
