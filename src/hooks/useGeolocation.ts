// Created a promise-based wrapper for getCurrentPosition - to be able to use async/await
// thats because getCurrentPosition is a callback-based function
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const [geolocationManually, setGeolocationManually] =
    useState<boolean>(false);

  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  const getLocation = async () => {
    setIsLoadingLocation(true);

    const getCurrentPositionPromise = () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

    try {
      if (navigator.geolocation) {
        const position = await getCurrentPositionPromise();
        setGeolocationManually(false);
        setLatitude(position.coords.latitude.toFixed(2));
        setLongitude(position.coords.longitude.toFixed(2));
      } else {
        console.error("Geolocation is not supported by this browser.");
        setGeolocationManually(true);
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        console.error("Error occurred: " + error.message);
        if (error.code === 1) {
          setGeolocationManually(true);
        }
      } else {
        console.error("An unexpected error occurred: " + error);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    latitude,
    longitude,
    geolocationManually,
    isLoadingLocation,
    setLatitude,
    setLongitude,
    setGeolocationManually,
  };
};
