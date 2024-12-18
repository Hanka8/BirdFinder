import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import MapModal from "./MapModal";
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
import { toLonLat } from "ol/proj";
import { InteractiveMapProps } from "../types";
import { radius } from "../constants";
import birdIcon from "../assets/bird-ico.svg";
import mapPin from "../assets/map-pin.svg";

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  data,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");

  const navigate = useNavigate();

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    if (!mapInstanceRef.current && mapRef.current) {
      const coordinates = fromLonLat([
        parseFloat(longitude),
        parseFloat(latitude),
      ]);

      const vectorSource = new VectorSource();
      vectorSourceRef.current = vectorSource;

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: coordinates,
          zoom: 12,
        }),
      });

      map.on("singleclick", (event) => {
        const clickedFeature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature
        );

        if (clickedFeature) {
          const description = clickedFeature.get("description");
          if (description) {
            setModalContent(description);
            setModalOpen(true);
          }
        } else {
          const clickedCoordinate = toLonLat(event.coordinate);
          setLatitude(clickedCoordinate[1].toFixed(2));
          setLongitude(clickedCoordinate[0].toFixed(2));

          navigate({
            to: `/location/${clickedCoordinate[1].toFixed(2)}/${clickedCoordinate[0].toFixed(2)}`,
            params: {
              latitude: clickedCoordinate[1].toFixed(2),
              longitude: clickedCoordinate[0].toFixed(2),
            },
          });
        }
      });

      mapInstanceRef.current = map;
    }
  }, [longitude, latitude, setLatitude, setLongitude, navigate]);

  useEffect(() => {
    if (vectorSourceRef.current && latitude && longitude) {
      const coordinates = fromLonLat([
        parseFloat(longitude),
        parseFloat(latitude),
      ]);

      const vectorSource = vectorSourceRef.current;
      vectorSource.clear();

      const marker = new Feature({
        geometry: new Point(coordinates),
      });

      marker.setStyle(
        new Style({
          image: new Icon({
            src: mapPin,
            scale: 1,
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
            width: 1,
          }),
          fill: new Fill({
            color: "rgba(0, 255, 0, 0.1)",
          }),
        })
      );

      data?.forEach((bird) => {
        const birdCoordinates = fromLonLat([bird.lng, bird.lat]);
        let existingFeature: Feature<Point> | undefined;

        vectorSource.forEachFeatureIntersectingExtent(
          new Point(birdCoordinates).getExtent(),
          (feature) => {
            existingFeature = feature as Feature<Point>;
          }
        );

        if (existingFeature) {
          const existingDescription = existingFeature.get("description");
          existingFeature.set(
            "description",
            `${existingDescription}, Bird Name: ${bird.comName}`
          );
        } else {
          const birdMarker = new Feature({
            geometry: new Point(birdCoordinates),
            description: `Bird Name: ${bird.comName}`,
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

          birdMarker.set("description", `Bird Name: ${bird.comName}`);
          vectorSource.addFeature(birdMarker);
        }
      });

      vectorSource.addFeatures([marker, circleFeature]);
    }
  }, [latitude, longitude, data]);

  return (
    <div className="w-full basis-2/5">
      <div
        ref={mapRef}
        className="w-full h-50vh md:h-screen md:fixed md:top-136"
      ></div>
      <MapModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
      />
    </div>
  );
};

export default InteractiveMap;
