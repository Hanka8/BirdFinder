import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getLocation } from "../functions/getLocation";
import BirdCard from "./BirdCard";
import FormGeolocation from "./FormGeolocation";
import Loading from "./Loading";
import Error from "./Error";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import { FetchBirdsNearby, Bird } from "../types";

const Index: React.FC = () => {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [isGeolocationManually, setGeolocationManually] =
    useState<boolean>(false);
  const [geolocationErrorMessage, setGeolocationErrorMessage] =
    useState<string>("");

  // get geolocation from browser when isGeolocationManually is false
  useEffect(() => {
    if (!isGeolocationManually) {
      setIsLoadingLocation(true);
      getLocation()
        .then((location) => {
          if (typeof location === "string") {
            setGeolocationErrorMessage(location);
            return;
          }
          setLatitude(location.latitude);
          setLongitude(location.longitude);
        })
        .then(() => {
          setIsLoadingLocation(false);
        });
    }
  }, [isGeolocationManually]);

  const fetchBirdsNearby: FetchBirdsNearby = async ({
    latitude,
    longitude,
  }) => {
      const response = await fetch(
        `https://api.ebird.org/v2/data/obs/geo/recent?dist=15&back=3&lat=${Number(latitude)}&lng=${Number(longitude)}`,
        {
          headers: {
            "X-eBirdApiToken": import.meta.env.VITE_API_KEY_EBIRD,
          },
        }
      );
      const data = await response.json();
      return data;
  };

  const {
    data,
    error,
    isLoading: isLoadingData,
    isFetching,
    refetch: refetchBirdData,
  } = useQuery({
    queryKey: ["birds"],
    queryFn: () => fetchBirdsNearby({ latitude, longitude }),
  });

  // refetch data when coords are changed
  useEffect(() => {
    refetchBirdData();
  }, [latitude, longitude, isGeolocationManually, refetchBirdData]);

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

  return (
    <div className="text-gray-800 bg-green-50 flex flex-col items-center min-h-screen">
      <div id="map" ref={mapRef} className="w-full h-64"></div>
      <h3 className="text-5xl m-8 text-green-700">Birds around you</h3>
      <div className="m-2 p-4 pb-8 bg-green-100">
        <FormGeolocation
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          geolocationManually={isGeolocationManually}
          refetchBirdData={refetchBirdData}
          setGeolocationManually={setGeolocationManually}
        />
      </div>
      {geolocationErrorMessage && (
        <>
          <p>could not get your location, please input it manually</p>
          <p>{geolocationErrorMessage}</p>
        </>
      )}
      {isLoadingLocation && <Loading loadingText="loading geolocation" />}
      {isLoadingData || isFetching && <Loading loadingText="loading birds" />}
      {error && <Error message={error.message} />}
      {data && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-5">
          {data.length > 0 &&
            data.map((bird: Bird) => (
              <BirdCard key={bird.speciesCode} bird={bird} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Index;
