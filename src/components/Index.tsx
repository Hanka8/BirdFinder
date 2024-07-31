import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import BirdCard from "./BirdCard";

type FetchBirdsNearby = (arg0: {
  latitude: number;
  longitude: number;
}) => Promise<any>;

function Index() {
  const API_KEY = import.meta.env.VITE_API_KEY_EBIRD;

  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const [geolocationManually, setGeolocationManually] =
    useState<boolean>(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocationManually(false);
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
        },
        (error) => {
          console.error("Error occurred: " + error.message);
          if (error.code == 1) {
            setGeolocationManually(true);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setGeolocationManually(true);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const fetchBirdsNearby: FetchBirdsNearby = async ({
    latitude,
    longitude,
  }) => {
    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent?dist=5&back=3&lat=${latitude}&lng=${longitude}`,
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
      <div className="m-2 p-4 bg-green-100">
        <h2 className="m-2 text-2xl text-green-700 text-center">Your location</h2>
        <form
          className=" text-gray-800 rounded flex flex-col md:flex-row"
          onSubmit={handleSubmit}
        >
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="geolocationManually"
              className="sr-only peer"
              checked={geolocationManually}
              onChange={(e) => setGeolocationManually(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              Insert geolocation manually
            </span>
          </label>
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            className="m-2 p-2 rounded bg-green-50 text-gray-700 border border-gray-300"
            disabled={!geolocationManually}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            className="m-2 p-2 rounded bg-green-50 text-gray-700 border border-gray-300"
            disabled={!geolocationManually}
          />
          <button
            type="submit"
            className={`m-2 p-2 w-60 rounded text-white 
        ${geolocationManually ? "bg-green-500 hover:bg-green-700" : "bg-gray-600"}
        `}
            disabled={!geolocationManually}
          >
            Submit
          </button>
        </form>
      </div>
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
