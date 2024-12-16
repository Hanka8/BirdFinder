import { useQuery, useQueries } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo } from "react";
import { radius } from "../constants";
import { getLocation } from "../functions/getLocation";
import BirdCard from "./BirdCard";
import InteractiveMap from "./InteractiveMap";
import FormGeolocation from "./FormGeolocation";
import Loading from "./Loading";
import NoBirds from "./NoBirds";
import Error from "./Error";
import "../index.css";
import { FetchBirdsNearby, Bird, FetchBirdData } from "../types";

const Index: React.FC = () => {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [isLoadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [geolocationErrorMessage, setGeolocationErrorMessage] =
    useState<string>("");
  const [adressFromMap, setAdressFromMap] = useState<string>("");
  const hasFetchedGeolocation = useRef(false);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // get geolocation from browser on first render
  useEffect(() => {
    // First check URL parameters
    const pathParts = window.location.pathname.split("/");
    if (pathParts[1] === "location" && pathParts[2] && pathParts[3]) {
      setLatitude(pathParts[2]);
      setLongitude(pathParts[3]);
      setLoadingLocation(false);
      return;
    }

    // If no URL params and haven't fetched geolocation yet, get it
    if (!hasFetchedGeolocation.current) {
      hasFetchedGeolocation.current = true;

      getLocation()
        .then((location) => {
          if (typeof location === "string") {
            setGeolocationErrorMessage(location);
            return;
          }
          const lat = location.latitude.toString();
          const lng = location.longitude.toString();

          // Set coordinates
          setLatitude(lat);
          setLongitude(lng);

          // Update URL
          navigate({
            to: "/location/$latitude/$longitude",
            params: { latitude: lat, longitude: lng },
            search: { latitude: lat, longitude: lng },
          });
        })
        .finally(() => {
          setLoadingLocation(false);
        });
    }
  }, [navigate]);

  const fetchBirdsNearby: FetchBirdsNearby = async ({
    latitude,
    longitude,
  }) => {
    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent?dist=${radius}&back=30&includeProvisional=true&lat=${Number(latitude)}&lng=${Number(longitude)}`,
      {
        headers: {
          "X-eBirdApiToken": import.meta.env.VITE_API_KEY_EBIRD,
        },
      }
    );
    const data = await response.json();
    return data;
  };

  const fetchBirdData: FetchBirdData = async (birdName) => {
    try {
      // First try with bird name
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${birdName}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.type !== "disambiguation") {
          return data;
        }
      }

      // Try with "(bird)" suffix if first response was disambiguation
      const speciesResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${birdName}_(bird)`
      );
      if (speciesResponse.ok) {
        const data = await speciesResponse.json();
        if (Object.keys(data).length > 0) {
          return data;
        }
      }

      // Try with "Common" prefix
      const commonResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/Common_${birdName}`
      );
      if (commonResponse.ok) {
        return await commonResponse.json();
      }

      // Try with "European" prefix
      const europeanResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/European_${birdName}`
      );
      if (europeanResponse.ok) {
        return await europeanResponse.json();
      }

    } catch (error) {
      console.error("Error fetching bird data from Wikipedia:", error);
      return {};
    }
  };

  const {
    data,
    error,
    isLoading: isLoadingData,
    isFetching,
    refetch: refetchBirdData,
  } = useQuery({
    queryKey: ["birds"],
    queryFn: () => fetchBirdsNearby({ latitude, longitude }),
  });

  // Add Wikipedia data queries
  const wikiQueries =
    data?.map((bird) => ({
      queryKey: ["birdData", bird.comName],
      queryFn: () => fetchBirdData(bird.comName),
    })) || [];

  const wikiResults = useQueries({
    queries: wikiQueries,
  });
  
  // Create a map for faster lookups
  const wikiDataMap = useMemo(() => {
    const map = new Map();
    wikiResults.forEach((result) => {
      if (result.data?.title) {
        map.set(result.data.title.toUpperCase(), result.data);
      }
    });
    return map;
  }, [wikiResults]);

  // refetch data when coords are changed
  useEffect(() => {
    refetchBirdData();
  }, [latitude, longitude, refetchBirdData]);

  // adress from map in better format
  const adressFromMapFormatted = adressFromMap.split(",");

  return (
    <div className="text-gray-800 bg-green-50 flex flex-col min-h-screen">
      <div className="flex justify-between items-center border-b border-gray-300 sticky top-0 z-10 bg-green-50">
        <h3 className="hidden sm:flex text-xl md:text-3xl font-bold m-4 text-green-700">
          Birdspotting
        </h3>
        <FormGeolocation
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          refetchBirdData={refetchBirdData}
          setLoadingLocation={setLoadingLocation}
          setAdressFromMap={setAdressFromMap}
        />
        <div className="text-sm md:text-md lg:text-lg text-right font-bold m-4 ml-0 text-green-700">
          {adressFromMapFormatted.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="basis-1/2">
          {geolocationErrorMessage && (
            <>
              <p>could not get your location, please input it manually</p>
              <p>{geolocationErrorMessage}</p>
            </>
          )}
          {isLoadingLocation && <Loading animationType="cylon" />}
          {isLoadingData || (isFetching && <Loading animationType="cylon" />)}
          {error && <Error message={error.message} />}
          {data &&
            data.length === 0 &&
            !isLoadingData &&
            !isLoadingLocation && <NoBirds />}
          {data && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 m-5">
              {data.length > 0 &&
                data.map((bird: Bird, index: number) => (
                  <BirdCard
                    key={bird.speciesCode}
                    bird={bird}
                    birdData={wikiResults[index]?.data ?? undefined}
                    isLoading={wikiResults[index]?.isLoading || false}
                    error={wikiResults[index]?.error as Error}
                    onLocationClick={() => setSelectedLocation(bird.locName)}
                  />
                ))}
            </div>
          )}
        </div>
        <InteractiveMap
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          data={data}
          wikiDataMap={wikiDataMap}
          selectedLocation={selectedLocation}
          onMapClick={() => setSelectedLocation(null)}
        />
      </div>
    </div>
  );
};

export default Index;
