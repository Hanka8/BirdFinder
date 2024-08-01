import { useQuery } from "@tanstack/react-query";
import { useEffect} from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import BirdCard from "./BirdCard";
import FormGeolocation from "./FormGeolocation";

type FetchBirdsNearby = (arg0: {
  latitude: string;
  longitude: string;
}) => Promise<any>;

function Index() {
  const API_KEY = import.meta.env.VITE_API_KEY_EBIRD;

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
          "X-eBirdApiToken": API_KEY,
        },
      }
    );
    return response.json();
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["birds"],
    queryFn: () => fetchBirdsNearby({ latitude, longitude }),
  });

  function handleSubmit(e: any) {
    e.preventDefault();
    refetch();
  }

  // fetch data when latitude or longitude changes but only when geolocation is not manually set
  useEffect(() => {
    !geolocationManually && refetch();
  }, [latitude, longitude, geolocationManually]);

  return (
    <div className="text-gray-800 bg-green-50 grid place-items-center">
      <h3 className="text-5xl m-8 text-green-700">Birds around you</h3>
      {isLoading && <p className="text-green-600">Loading...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
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
        <p className="text-green-600">Loading location...</p>
      )}
      {isLoading && <p className="text-green-600">Loading data...</p>}
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

// https://documenter.getpostman.com/view/664302/S1ENwy59
