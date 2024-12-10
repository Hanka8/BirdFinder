import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { radius } from "../constants";
import { getLocation } from "../functions/getLocation";
import BirdCard from "./BirdCard";
import InteractiveMap from "./InteractiveMap";
import FormGeolocation from "./FormGeolocation";
import Loading from "./Loading";
import Error from "./Error";
import "../index.css";
import { FetchBirdsNearby, Bird } from "../types";

const Index: React.FC = () => {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [isLoadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [geolocationErrorMessage, setGeolocationErrorMessage] =
    useState<string>("");
  const [adressFromMap, setAdressFromMap] = useState<string>("");
  const hasFetchedGeolocation = useRef(false);
  const navigate = useNavigate();

  // get geolocation from browser on first render
  useEffect(() => {
    // First check URL parameters
    const pathParts = window.location.pathname.split("/");
    if (pathParts[1] === "location" && pathParts[2] && pathParts[3]) {
      setLatitude(pathParts[2]);
      setLongitude(pathParts[3]);
      setLoadingLocation(false);
      return;
    }

    // If no URL params and haven't fetched geolocation yet, get it
    if (!hasFetchedGeolocation.current) {
      hasFetchedGeolocation.current = true;

      getLocation()
        .then((location) => {
          if (typeof location === "string") {
            setGeolocationErrorMessage(location);
            return;
          }
          const lat = location.latitude.toString();
          const lng = location.longitude.toString();

          // Set coordinates
          setLatitude(lat);
          setLongitude(lng);

          // Update URL
          navigate({
            to: "/location/$latitude/$longitude",
            params: { latitude: lat, longitude: lng },
            search: { latitude: lat, longitude: lng },
          });
        })
        .finally(() => {
          setLoadingLocation(false);
        });
    }
  }, [navigate]);

  const fetchBirdsNearby: FetchBirdsNearby = async ({
    latitude,
    longitude,
  }) => {
    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent?dist=${radius}&back=30&includeProvisional=true&lat=${Number(latitude)}&lng=${Number(longitude)}`,
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
  }, [latitude, longitude, refetchBirdData]);

  // adress from map in better format
  const adressFromMapFormatted = adressFromMap.split(",");

  return (
    <div className="text-gray-800 bg-green-50 flex flex-col min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-300 sticky top-0 z-10 bg-green-50">
        <h3 className="basis-1/4 text-3xl font-bold m-8 text-green-700">
          Birdspotting
        </h3>
        <FormGeolocation
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          refetchBirdData={refetchBirdData}
          setLoadingLocation={setLoadingLocation}
          setAdressFromMap={setAdressFromMap}
        />
        <div className="basis-1/4 text-l text-right font-bold m-8 text-green-700">
          {adressFromMapFormatted.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="basis-3/5">
        {geolocationErrorMessage && (
          <>
            <p>could not get your location, please input it manually</p>
            <p>{geolocationErrorMessage}</p>
          </>
        )}
        {isLoadingLocation && <Loading loadingText="loading geolocation" />}
        {isLoadingData ||
          (isFetching && <Loading loadingText="loading birds" />)}
        {error && <Error message={error.message} />}
        {data && (
          <div className="grid  gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-5">
            {data.length > 0 &&
              data.map((bird: Bird) => (
                <BirdCard key={bird.speciesCode} bird={bird} />
              ))}
          </div>
        )}
        </div>
        <InteractiveMap
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          data={data}
        />
      </div>
    </div>
  );
};

export default Index;
