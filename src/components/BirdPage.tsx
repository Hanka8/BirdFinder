import { FetchBirdData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

const BirdPage = () => {
  const { bird } = useParams({ from: "/$bird" });

  const birdName = bird.replace(/_/g, " ");

  const fetchBirdData: FetchBirdData = async (birdName) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${birdName}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bird data from Wikipedia:", error);
      return {};
    }
  };

  const {
    data: birdData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["birdData", birdName],
    queryFn: () => fetchBirdData(birdName),
  });

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {birdData && (
        <div>
          <h1 className="text-3xl font-bold mb-4">{birdData.title}</h1>
          <p className="text-gray-700 mb-4">{birdData.description}</p>
          <img
            className="rounded-lg mx-auto mb-4"
            src={birdData.thumbnail?.source}
            alt={birdData.title}
            width={birdData.thumbnail?.width}
            height={birdData.thumbnail?.height}
          />
          <p className="text-gray-700">{birdData.extract}</p>
        </div>
      )}
    </div>
  );
};

export default BirdPage;
