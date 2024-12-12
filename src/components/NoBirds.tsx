import { GiKiwiBird } from "react-icons/gi";

const NoBirds = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center text-center gap-4 mt-10 text-green-700">
      <GiKiwiBird size={75} />
      <h2 className="font-bold text-xl">No birds found</h2>
      <p>Try changing the location</p>
    </div>
  );
};

export default NoBirds;
