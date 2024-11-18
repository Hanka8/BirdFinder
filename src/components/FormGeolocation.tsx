import { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LocationFormProps } from "../types";

const LocationForm: React.FC<LocationFormProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  refetchBirdData,
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
    setLoadingLocation(false);
  };

  useEffect(() => {
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
        <div className="m-2 flex flex-col relative">
          <input
            id="adress"
            type="text"
            placeholder="Adress"
            value={adress}
            onChange={handleAdressChange}
            className={
              "w-60 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 focus:outline-none p-2 rounded text-gray-700 border border-gray-300 bg-green-50"
            }
          />
          <label htmlFor="adress" className="absolute top-11 left-1 text-sm">
            Adress
          </label>
        </div>
        <button
          type="submit"
          className={"m-2 p-2 w-60 rounded text-white bg-green-600"}
          onClick={handleSubmitAdress}
        >
          Search birds
        </button>
      </form>
    </div>
  );
};

export default LocationForm;
