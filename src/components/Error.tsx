import { ErrorProps } from "../types";

const Error: React.FC<ErrorProps> = ({
  message
}) => {
  return (
    <div className="error-container p-4 border border-red-500 rounded bg-red-100 text-red-700">
      <h2 className="text-lg font-bold">Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
};

export default Error;
