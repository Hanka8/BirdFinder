import { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LocationFormProps, RegionalStructureItem } from "../types";

const LocationForm: React.FC<LocationFormProps> = ({
  latitude,
  longitude,
  adressFromMap,
  setLatitude,
  setLongitude,
  refetchBirdData,
  setLoadingLocation,
  setAdressFromMap,
}) => {
    
  // handle latitude/longitude input changes - allowing empty string for allowing user to clear the input
  const handleLatitudeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 90)) {
      setLatitude(value);
    }
  };

  const handleLongitudeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= -180 && Number(value) <= 180)) {
      setLongitude(value);
    }
  };

  return (
    <div className="m-2 p-4 pb-8 bg-green-100">
      <h2 className="m-2 text-2xl text-green-700 text-center">Your location</h2>
      {adressFromMap && (
        <p className="m-2 text-gray-800 text-center">{adressFromMap}</p>
      )}
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
