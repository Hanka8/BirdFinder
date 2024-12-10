import { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { LocationFormProps, RegionalStructureItem } from "../types";

const LocationForm: React.FC<LocationFormProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  refetchBirdData,
  setLoadingLocation,
  setAdressFromMap,
}) => {
  const [adress, setAdress] = useState<string>(latitude);

  const handleAdressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAdress(e.target.value);
  };

  const getCoordinatesFromAdress = async (adress: string) => {
    const url = `https://api.mapy.cz/v1/geocode?query=${adress}&lang=en`;
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
      if (data.items[0].regionalStructure) {
        let adressString = "";
        data.items[0].regionalStructure.forEach(
          (item: RegionalStructureItem) => {
            adressString += item.name + ", ";
          }
        );
        adressString = adressString.slice(0, -2);
        setAdressFromMap(adressString);
      }
      setLatitude(data.items[0].position.lat);
      setLongitude(data.items[0].position.lon);
    }
  }, [data, isLoading, error, setLatitude, setLongitude, setAdressFromMap]);

  useEffect(() => {
    const getAdressFromCoordinates = async () => {
      const url = `https://api.mapy.cz/v1/rgeocode?lon=${longitude}&lat=${latitude}&lang=en`;
      const response = await fetch(url, {
        headers: {
          "X-Mapy-Api-Key": import.meta.env.VITE_API_KEY_MAPY,
        },
      });
      return response.json();
    };

    if (!latitude || !longitude) return;
    getAdressFromCoordinates().then((data) => {
      if (data && data.items[0].name && data.items[0].location) {
        setAdressFromMap(`${data.items[0].name}, ${data.items[0].location}`);
      }
    });
  }, [latitude, longitude, setAdressFromMap]);

  return (
    <form
      className="text-gray-800 w-full max-w-96"
      onSubmit={handleSubmitAdress}
    >
      <div className="flex items-center relative filter drop-shadow-md">
        <input
          id="adress"
          type="text"
          placeholder="Adress"
          value={adress}
          onChange={handleAdressChange}
          className="w-full p-2 pl-6 rounded-full text-gray-700 border border-gray-300 bg-white focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 focus:outline-none"
        />
        <label htmlFor="adress" className="hidden">
          Adress
        </label>
        <button
          aria-label="Search"
          type="submit"
          className="absolute right-0 m-2 p-2 rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
          onClick={handleSubmitAdress}
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default LocationForm;
