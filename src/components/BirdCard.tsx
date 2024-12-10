import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Link } from "@tanstack/react-router";
import { FetchBirdData, BirdCardProps } from "../types";
import Loading from "./Loading";
import Error from "./Error";

const BirdCard: React.FC<BirdCardProps> = ({ bird }) => {
  const formattedDate = format(parseISO(bird.obsDt), "d MMMM yyyy");
  const formattedTime = format(parseISO(bird.obsDt), "H:mm");

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
    queryKey: ["birdData", bird.sciName],
    queryFn: () => fetchBirdData(bird.sciName),
  });

  const birdSciNameTrimmed = bird.sciName.replace(" ", "_");

  return (
    <Link to={`/${birdSciNameTrimmed}`}>
      <div
        key={bird.speciesCode}
        className="bg-green-50 border border-green-400 rounded-lg w-full max-w-sm mx-auto shadow-md hover:-translate-y-2 transition-transform duration-300 hover:bg-green-100"
      >
        {birdData?.thumbnail && (
          <div
            className="w-full h-60 bg-cover bg-center rounded-t-lg"
            style={{
              backgroundImage: `url(${birdData?.thumbnail?.source})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        )}
        {isLoading && (
          <Loading
            loadingText="loading image"
            animationType="spinningBubbles"
          />
        )}
        {error && <Error message={error.message} />}
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {bird.comName}
          </h3>
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
      </div>
    </Link>
  );
};

export default BirdCard;
