import { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import { Icon, Style, Stroke, Fill } from "ol/style";
import { InteractiveMapProps } from "../types";
import { radius } from "../constants";
import birdIcon from "../assets/bird-ico.svg";

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  data,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

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
        center: coordinates,
        zoom: 12,
      }),
    });

    // Add main marker for the central location
    const marker = new Feature({
      geometry: new Point(coordinates),
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.75,
        }),
      })
    );

    const circleFeature = new Feature({
      geometry: new Circle(coordinates, radius * 1000),
    });

    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(0, 128, 0, 0.8)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(0, 255, 0, 0.2)",
        }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker, circleFeature],
    });

    data?.forEach((bird) => {
      const birdCoordinates = fromLonLat([bird.lng, bird.lat]);
      const birdMarker = new Feature({
        geometry: new Point(birdCoordinates),
      });

      birdMarker.setStyle(
        new Style({
          image: new Icon({
            src: birdIcon,
            scale: 0.75,
            color: "rgba(255, 0, 0, 0.8)",
          }),
        })
      );

      vectorSource.addFeature(birdMarker); 
    });

    const markerLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(markerLayer);

    return () => map.setTarget(undefined);
  }, [latitude, longitude, data]);

  return <div ref={mapRef} className="w-full h-32rem"></div>;
};

export default InteractiveMap;
