import { useRef, useEffect, useMemo} from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon, Map as LeafletMap, DivIcon } from "leaflet";
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

const animatedBirdIcon = new DivIcon({
  className: "custom-div-icon",
  html: `
    <style>
      .bird-marker {
        width: 25px;
        height: 25px;
        background-image: url(${birdIcon});
        background-size: contain;
        background-repeat: no-repeat;
      }
      .bird-marker.animate {
        animation: pulseScale 1s ease-in-out infinite;
        transform-origin: center center;
      }
      @keyframes pulseScale {
        0% {
          transform: scale(.9);
          opacity: 1;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.7;
        }
        100% {
          transform: scale(.9);
          opacity: 1;
        }
      }
    </style>
    <div class="bird-marker animate"></div>
  `,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

const MapEvents: React.FC<{
  setLatitude: (lat: string) => void;
  setLongitude: (lng: string) => void;
  shouldUpdateCenter: React.MutableRefObject<boolean>;
}> = ({
  setLatitude,
  setLongitude,
  shouldUpdateCenter,
}) => {
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
  wikiDataMap,
  selectedLocation,
  onMapClick,
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

  // Add effect to handle selected location
  useEffect(() => {
    if (selectedLocation && mapRef.current && data) {
      const selectedBird = data.find(
        (bird) => bird.locName === selectedLocation
      );
      if (selectedBird) {
        shouldUpdateCenter.current = false;
        mapRef.current.setView([selectedBird.lat, selectedBird.lng], 14, {
          animate: true,
          duration: 1,
        });
      }
    }
  }, [selectedLocation, data]);

  if (!latitude || !longitude) return null;

  return (
    <div className="w-full md:w-1/2 md:ml-auto">
      <div
        ref={containerRef}
        onClick={onMapClick}
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
            .map((marker) => {
              const isHighlighted = marker.birds.some(
                (b) => b.locName === selectedLocation
              );
              return (
                <Marker
                  key={marker.key}
                  position={marker.position}
                  icon={isHighlighted ? animatedBirdIcon : customBirdIcon}
                >
                  <Popup>
                    <BirdPopup birds={marker.birds} wikiDataMap={wikiDataMap} />
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;
