import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  const [isLoadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [geolocationErrorMessage, setGeolocationErrorMessage] =
    useState<string>("");

  // get geolocation from browser on first render
  useEffect(() => {
      setLoadingLocation(true);
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
          setLoadingLocation(false);
        });
  }, []);

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

  return (
    <div className="text-gray-800 bg-green-50 flex flex-col items-center min-h-screen">
      <h3 className="text-5xl m-8 text-green-700">Birds around you</h3>
      <InteractiveMap latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} data={data} />
      <div className="m-2 p-4 pb-8 bg-green-100">
        <FormGeolocation
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          refetchBirdData={refetchBirdData}
          setLoadingLocation={setLoadingLocation}
        />
      </div>
      {geolocationErrorMessage && (
        <>
          <p>could not get your location, please input it manually</p>
          <p>{geolocationErrorMessage}</p>
        </>
      )}
      {isLoadingLocation && <Loading loadingText="loading geolocation" />}
      {isLoadingData || (isFetching && <Loading loadingText="loading birds" />)}
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
