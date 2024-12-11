import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Link } from "@tanstack/react-router";
import { FetchBirdData, BirdCardProps } from "../types";
import { IoLocationOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import Loading from "./Loading";
import Error from "./Error";

const BirdCard: React.FC<BirdCardProps> = ({ bird }) => {
  const formattedDate = format(parseISO(bird.obsDt), "d.MM.");
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
        className="bg-white border rounded-lg w-full max-w-sm mx-auto shadow-md hover:-translate-y-2 transition-transform duration-300"
      >
        {birdData?.thumbnail && (
          <div
            className="w-full h-60 bg-cover bg-center rounded-t-lg relative"
            style={{
              backgroundImage: `url(${birdData?.thumbnail?.source})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
            }}
          >
            {bird.howMany > 1 && (
                <p className="absolute right-2 top-2 bg-white p-1 rounded-full flex items-center justify-center font-semibold w-8 h-8 shadow-md">
                {bird.howMany}
                </p>
            )}
          </div>
        )}
        {isLoading && (
          <Loading
            loadingText="loading image"
            animationType="spinningBubbles"
          />
        )}
        {error && <Error message={error.message} />}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            {bird.comName}
          </h3>
          <p className="flex items-center gap-1 text-gray-700">
            <IoTimeOutline size={20} />
            {formattedTime}, {formattedDate}
          </p>
          <p className="flex items-start gap-1 text-gray-700 mt-2 italic">
            <IoLocationOutline size={20} className="shrink-0"/>
            {bird.locName}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BirdCard;
