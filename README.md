
## takeaways

### double rendering
- React's Strict Mode can cause components to render twice in development mode to help identify side effects
- Purpose: Strict Mode helps catch side effects by intentionally invoking components and lifecycle methods (like useEffect) twice. This allows developers to identify components that have unintended side effects or depend on outdated state, which can be problematic if they aren't idempotent (i.e., they produce the same result no matter how many times they're run)

### asynchronous browsers apis
- The navigator.geolocation.getCurrentPosition method is asynchronous, which means that it doesn't block the execution of the rest of your code while it waits for the geolocation request to complete. Instead, it schedules the callback functions (success and error) to be executed once the location data is available or an error occurs.

  // const fetchBirdSounds: any = async (birdName: any) => {
  //   const endpoint = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(
  //     birdName
  //   )}`;
  //   try {
  //     const response = await fetch(endpoint);
  //     const data = await response.json();
  //     // console.log(data.recordings[0]);
  //     return data.recordings[0].id;
  //   } catch (error) {
  //     console.error("Error fetching sounds from Xeno-Canto:", error);
  //     return [];
  //   }
  // };

    // const {
  //   data: soundsData,
  //   error: soundsError,
  //   isLoading: soundsIsLoading,
  // } = useQuery({
  //   queryKey: ["sounds", bird.sciName],
  //   queryFn: () => fetchBirdSounds(bird.sciName),
  // });

        {/* {soundsIsLoading && <p className="text-gray-600">Loading sounds...</p>}
      {soundsError && (
        <p className="text-red-500">Error: {soundsError.message}</p>
      )}
      {soundsData && imagesData && (
          <iframe
            src={`https://xeno-canto.org/${soundsData}/embed?simple=1`}
            scrolling="no"
            frameborder="0"
            width="100%"
            height="220"
          ></iframe>
      )} */}