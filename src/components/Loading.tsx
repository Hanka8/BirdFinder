import { LoadingProps } from '../types';
import ReactLoading from 'react-loading';

const Loading: React.FC<LoadingProps> = ({loadingText, animationType}) => {

    return (
      <div className="grid place-items-center gap-4 text-green-700">
        <ReactLoading
          type={animationType || "bars"}
          color={"#15803d"}
          height={"35%"}
          width={"35%"}
        />
        <p>{loadingText}</p>
      </div>
    );
};

export default Loading;