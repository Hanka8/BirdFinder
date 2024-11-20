import { useState, useEffect, useRef } from "react";
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

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  data,
}) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");

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
        }
      });

      mapInstanceRef.current = map;
    }
  }, [longitude, latitude, setLatitude, setLongitude]);



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

      vectorSource.addFeatures([marker, circleFeature]);

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

        birdMarker.set("description", `Bird Name: ${bird.comName}`);
        vectorSource.addFeature(birdMarker);
      });
    }
  }, [latitude, longitude, data]);

  return (
    <div className="w-full h-32rem">
      <div ref={mapRef} className="w-full h-32rem"></div>
      <MapModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
      />
    </div>
  );
};

export default InteractiveMap;
