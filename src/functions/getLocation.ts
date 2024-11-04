// Created a promise-based wrapper for getCurrentPosition - to be able to use async/await
// thats because getCurrentPosition is a callback-based function
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

export const getLocation = async () => {

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
      return "Geolocation is not supported by this browser."
    }
  } catch (error) {
    if (error instanceof GeolocationPositionError) {
      console.error("Error occurred: " + error.message);
      return error.message;
    } else {
      console.error("An unexpected error occurred: " + error);
      return "An unexpected error occurred during getting geolocation from the browser."
    }
  } 
};
