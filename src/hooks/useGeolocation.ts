// Created a promise-based wrapper for getCurrentPosition - to be able to use async/await
// thats because getCurrentPosition is a callback-based function
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

import { useState } from "react";

export const useGeolocation = () => {

  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [geolocationErrorMessage, setGeolocationErrorMessage] = useState<string>("");

  const getLocation = async () => {
    setIsLoadingLocation(true);

    const getCurrentPositionPromise = () =>
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

    try {
      if (navigator.geolocation) {
        const position = await getCurrentPositionPromise();
        const latitude = position.coords.latitude.toFixed(2);
        const longitude = position.coords.longitude.toFixed(2);
        return { latitude, longitude };
      } else {
        console.error("Geolocation is not supported by this browser.");
        setGeolocationErrorMessage("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        setGeolocationErrorMessage(error.message);
        console.error("Error occurred: " + error.message);
      } else {
        setGeolocationErrorMessage("An unexpected error occurred.");
        console.error("An unexpected error occurred: " + error);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return {
    getLocation,
    isLoadingLocation,
    geolocationErrorMessage,
  };
};
