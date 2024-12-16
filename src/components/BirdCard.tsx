import { format, parseISO } from "date-fns";
import { BirdCardProps } from "../types";
import { IoLocationOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import Loading from "./Loading";
import Error from "./Error";

const BirdCard: React.FC<BirdCardProps> = ({ bird, birdData, isLoading, error, onLocationClick }) => {
  const formattedDate = format(parseISO(bird.obsDt), "d.MM.");
  const formattedTime = format(parseISO(bird.obsDt), "H:mm");

  return (
      <div
        key={bird.speciesCode}
        className="bg-white border rounded-lg w-full max-w-sm mx-auto shadow-md"
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
        {isLoading && <Loading animationType="spokes" />}
        {error && <Error message={error.message} />}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            {bird.comName}
          </h3>
          <p className="flex items-center gap-1 text-gray-700">
            <IoTimeOutline size={20} />
            {formattedTime}, {formattedDate}
          </p>
          <p 
            className="flex items-start gap-1 text-gray-700 mt-2 italic hover:underline hover:cursor-pointer"
            onClick={() => onLocationClick?.(bird.locName)}
          >
            <IoLocationOutline size={20} className="shrink-0"/>
            {bird.locName}
          </p>
        </div>
      </div>  
  );
};

export default BirdCard;
