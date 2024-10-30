import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { FetchBirdData, BirdCardProps } from "../types";
import Loading from "./Loading";
import Error from "./Error";

const BirdCard: React.FC<BirdCardProps> = ({ bird }) => {
  const formattedDate = format(parseISO(bird.obsDt), "d MMMM yyyy");
  const formattedTime = format(parseISO(bird.obsDt), "H:mm");

  const fetchBirdData: FetchBirdData = async (birdName) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${birdName}`,
      );
      const data = await response.json();
      return data;
    } catch(error) {
      console.error("Error fetching bird data from Wikipedia:", error);
      return {};
    }
  }

  const {
    data: birdData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["birdData", bird.sciName],
    queryFn: () => fetchBirdData(bird.sciName),
  });

  return (
    <div
      key={bird.speciesCode}
      className="bg-green-50 border border-green-400 rounded-lg p-4 w-full max-w-sm mx-auto shadow-md"
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        {bird.comName}
      </h3>
      {isLoading && (
        <Loading loadingText="loading image" animationType="spinningBubbles" />
      )}
      {error && <Error message={error.message} />}
      {birdData && (
          <img
            className="rounded-lg mx-auto h-48 object-contain"
            src={birdData.thumbnail?.source}
            alt={birdData.title}
          />
      )}
      <p className="text-gray-700">
        <b className="text-gray-900">Count:</b> {bird.howMany}
      </p>
      <p className="text-gray-700">
        <b className="text-gray-900">Location:</b> {bird.locName}
      </p>
      <p className="text-gray-700">
        <b className="text-gray-900">Date:</b> {formattedDate}
      </p>
      <p className="text-gray-700">
        <b className="text-gray-900">Time:</b> {formattedTime}
      </p>
    </div>
  );
};

export default BirdCard;
