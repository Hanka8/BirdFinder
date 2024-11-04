import { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import { InteractiveMapProps } from "../types";

const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  // create map when latitude and longitude are set
  useEffect(() => {
    if (!latitude || !longitude) return;

    const coordinates = fromLonLat([
      parseFloat(longitude),
      parseFloat(latitude),
    ]);

    const map = new Map({
      target: mapRef.current || undefined,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 12,
      }),
    });

    map.getView().setCenter(coordinates);

    return () => map.setTarget(undefined);
  }, [latitude, longitude]);

  return <div id="map" ref={mapRef} className="w-full h-32rem"></div>;
};

export default InteractiveMap;
