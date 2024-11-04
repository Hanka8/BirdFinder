

import { MapModalProps } from "../types";

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-lg font-bold">Info</h2>
        <p>{content}</p>
        <button
          onClick={onClose}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MapModal;
