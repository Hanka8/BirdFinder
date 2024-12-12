import { BirdPopupProps } from "../types";
import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const BirdPopup: React.FC<BirdPopupProps> = ({ birds, wikiDataMap }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === birds.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? birds.length - 1 : prevIndex - 1
    );
  };

  const currentBird = birds[currentIndex];
  const wikiData = wikiDataMap.get(currentBird.comName.toUpperCase());

  return (
    <div className="bird-popup relative">
      <div className="relative">
        {wikiData?.thumbnail && (
          <img
            src={wikiData.thumbnail.source}
            alt={currentBird.comName}
            className="w-full object-cover rounded-t-xl"
          />
        )}
        
        {birds.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
              className="absolute left-1 bottom-1 p-2 bg-white/75 hover:bg-white rounded-full shadow-md"
            >
              <IoChevronBackOutline size={15} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              className="absolute right-1 bottom-1 p-2 bg-white/75 hover:bg-white rounded-full shadow-md"
            >
              <IoChevronForwardOutline size={15} />
            </button>
          </>
        )}
      </div>

      <div className="text-center">
        <p className="font-bold">{currentBird.comName}</p>
      </div>

      {birds.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {birds.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BirdPopup;
