import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import BirdCard from "./BirdCard";
import FormGeolocation from "./FormGeolocation";
import Loading from "./Loading";
import Error from "./Error";
import { FetchBirdsNearby } from "../types";

const Index: React.FC = () => {
  const {
    latitude,
    longitude,
    geolocationManually,
    isLoadingLocation,
    setLatitude,
    setLongitude,
    setGeolocationManually,
  } = useGeolocation();

  const fetchBirdsNearby: FetchBirdsNearby = async ({
    latitude,
    longitude,
  }) => {
    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent?dist=5&back=3&lat=${Number(latitude)}&lng=${Number(longitude)}`,
      {
        headers: {
          "X-eBirdApiToken": import.meta.env.VITE_API_KEY_EBIRD,
        },
      }
    );
    return response.json();
  };

  function handleSubmit(e: any) {
    e.preventDefault();
    refetch();
  }

  const { data, error, isLoading: isLoadingData, refetch } = useQuery({
    queryKey: ["birds"],
    queryFn: () => fetchBirdsNearby({ latitude, longitude }),
  });

  // fetch data when latitude or longitude changes but only when geolocation is not manually set
  useEffect(() => {
    !geolocationManually && refetch();
  }, [latitude, longitude, geolocationManually]);

  return (
    <div className="text-gray-800 bg-green-50 flex flex-col items-center min-h-screen">
      <h3 className="text-5xl m-8 text-green-700">Birds around you</h3>
      <div className="m-2 p-4 pb-8 bg-green-100">
        <FormGeolocation
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          geolocationManually={geolocationManually}
          handleSubmit={handleSubmit}
          setGeolocationManually={setGeolocationManually}
        />
      </div>
      {isLoadingLocation && (
        <Loading loadingText="loading geolocation" />
      )}
      {isLoadingData && <Loading loadingText="loading birds" />}
      {error && <Error message={error.message} />}
      {data && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-5">
          {data.length > 0 &&
            data.map((bird: any) => (
              <BirdCard key={bird.speciesCode} bird={bird} />
            ))}
        </div>
      )}
    </div>
  );
}

export default Index;
