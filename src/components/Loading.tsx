import { LoadingProps } from "../types";
import ReactLoading from "react-loading";

const Loading: React.FC<LoadingProps> = ({ animationType }) => {
  return (
    <div className="grid place-items-center text-green-700">
      <ReactLoading
        type={animationType || "bars"}
        color={"#15803d"}
        height={"35%"}
        width={"35%"}
      />
    </div>
  );
};

export default Loading;
