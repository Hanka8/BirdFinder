import { ChangeEvent } from "react";
import { LocationFormProps } from "../types";

const LocationForm: React.FC<LocationFormProps> = ({
  latitude,
  longitude,
  geolocationManually,
  setLatitude,
  setLongitude,
  handleSubmit,
  setGeolocationManually,
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
      <form
        className="text-gray-800 rounded flex flex-col items-center gap-4 lg:flex-row"
        onSubmit={handleSubmit}
      >
        <label className="inline-flex items-center cursor-pointer p-3">
          <input
            type="checkbox"
            id="geolocationManually"
            className="sr-only peer"
            checked={geolocationManually}
            onChange={(e) => setGeolocationManually(e.target.checked)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 flex-shrink-0"></div>
          <span className="ms-3 text-sm font-medium text-gray-700">
            Insert manually
          </span>
        </label>
        <div className="m-2 flex flex-col relative">
          <input
            id="latitude"
            type="number"
            min={0}
            max={90}
            step={0.01}
            placeholder="Latitude"
            value={latitude}
            onChange={handleLatitudeChange}
            className={`w-60 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 focus:outline-none p-2 rounded text-gray-700 border border-gray-300 ${geolocationManually ? "bg-green-50" : "bg-gray-200"}`}
            disabled={!geolocationManually}
          />
          <label htmlFor="latitude" className="absolute top-11 left-1 text-sm">
            Latitude
          </label>
        </div>
        <div className="m-2 flex flex-col relative">
          <input
            id="longitude"
            type="number"
            min={-180}
            max={180}
            step={0.01}
            placeholder="Longitude"
            value={longitude}
            onChange={handleLongitudeChange}
            className={`w-60 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50 focus:outline-none p-2 rounded text-gray-700 border border-gray-300 ${geolocationManually ? "bg-green-50" : "bg-gray-200"}`}
            disabled={!geolocationManually}
          />
          <label htmlFor="longitude" className="absolute top-11 left-1 text-sm">
            Longitude
          </label>
        </div>
        <button
          type="submit"
          className={`m-2 p-2 w-60 rounded text-white ${geolocationManually ? "bg-green-500 hover:bg-green-700" : "bg-gray-600"}`}
          disabled={!geolocationManually}
        >
          Search birds
        </button>
      </form>
    </div>
  );
};

export default LocationForm;
