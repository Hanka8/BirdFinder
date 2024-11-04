import { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LocationFormProps } from "../types";

const LocationForm: React.FC<LocationFormProps> = ({
  latitude,
  longitude,
  geolocationManually,
  setLatitude,
  setLongitude,
  refetchBirdData,
  setGeolocationManually,
  setLoadingLocation,
}) => {
  const [adress, setAdress] = useState<string>(latitude);

  const handleAdressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAdress(e.target.value);
  };

  const getCoordinatesFromAdress = async (adress: string) => {
    const url = `https://api.mapy.cz/v1/geocode?query=${adress}`;
    const response = await fetch(url, {
      headers: {
        "X-Mapy-Api-Key": import.meta.env.VITE_API_KEY_MAPY,
      },
    });
    return response.json();
  };

  const {
    data,
    error,
    isLoading,
    refetch: refetchCoords,
  } = useQuery({
    queryKey: ["coordinates"],
    queryFn: () => getCoordinatesFromAdress(adress),
  });

  const handleSubmitAdress = (e: React.FormEvent) => {
    e.preventDefault();
    refetchCoords().then(() => {
      refetchBirdData();
    });
  };

  const handleCheckBoxChange = () => {
    setGeolocationManually(!geolocationManually);
    if (geolocationManually) {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (!geolocationManually) return;
    if (!data) return;
    if (isLoading) return;
    if (error) return;

    if (
      data.items[0] &&
      data.items[0].position.lat &&
      data.items[0].position.lon
    ) {
      setLatitude(data.items[0].position.lat);
      setLongitude(data.items[0].position.lon);
    }

  }, [
    geolocationManually,
    data,
    isLoading,
    error,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
  ]);

  return (
    <div className="m-2 p-4 pb-8 bg-green-100">
      <h2 className="m-2 text-2xl text-green-700 text-center">Your location</h2>
      <form
        className="text-gray-800 rounded flex flex-col items-center gap-4 lg:flex-row"
        onSubmit={handleSubmitAdress}
      >
        <label className="inline-flex items-center cursor-pointer p-3">
          <input
            type="checkbox"
            id="geolocationManually"
            className="sr-only peer"
            checked={geolocationManually}
            onChange={handleCheckBoxChange}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 flex-shrink-0"></div>
          <span className="ms-3 text-sm font-medium text-gray-700">
            {geolocationManually ? "Get your location" : "Set adress manually" }
          </span>
        </label>
        <div className="m-2 flex flex-col relative">
          <input
            id="adress"
            type="text"
            placeholder="Adress"
            value={adress}
            onChange={handleAdressChange}
            className={`w-60 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 focus:outline-none p-2 rounded text-gray-700 border border-gray-300 ${geolocationManually ? "bg-green-50" : "bg-gray-200"}`}
            disabled={!geolocationManually}
          />
          <label htmlFor="adress" className="absolute top-11 left-1 text-sm">
            Adress
          </label>
        </div>
        <button
          type="submit"
          className={`m-2 p-2 w-60 rounded text-white ${geolocationManually ? "bg-green-500 hover:bg-green-700" : "bg-gray-600"}`}
          onClick={handleSubmitAdress}
          disabled={!geolocationManually}
        >
          Search birds
        </button>
      </form>
    </div>
  );
};

export default LocationForm;
