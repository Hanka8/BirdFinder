import { BirdPopupProps } from "../types";
import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useSwipeable } from "react-swipeable";

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const currentBird = birds[currentIndex];
  
  const wikiData =
    wikiDataMap.get(currentBird.comName.toUpperCase()) ||
    // if no bird change eurasian to common and vice versa
    wikiDataMap.get(
      currentBird.comName
        .replace("EURASIAN", "COMMON")
        .replace("COMMON", "EURASIAN")
        .toUpperCase()
    ) ||
    // if rook go to bird page
    (currentBird.comName.toUpperCase() === "ROOK"
      ? wikiDataMap.get("ROOK (BIRD)")
      : null) ||
    // if rock pigeon go to rock dove
    (currentBird.comName.toUpperCase() === "ROCK PIGEON"
      ? wikiDataMap.get("ROCK DOVE")
      : null) ||
      // replace "-" with " "
      (currentBird.comName.includes("-")
        ? wikiDataMap.get(currentBird.comName.replace(/-/g, " ").toUpperCase())
        : null) ||
    wikiDataMap.get(
      currentBird.comName.split(" ").slice(1).join(" ").toUpperCase()
    ) ||
    Array.from(wikiDataMap.entries()).find(([key]) =>
      key.includes(
        currentBird.comName.split(" ").slice(1).join(" ").toUpperCase()
      )
    )?.[1];

  return (
    <div className="bird-popup relative" {...swipeHandlers}>
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
