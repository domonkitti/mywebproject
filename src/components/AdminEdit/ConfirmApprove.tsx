import { IoClose } from "react-icons/io5";

interface ConfirmApproveProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmApprove = ({ isOpen, onClose }: ConfirmApproveProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center">Confirm Approve</h2>
      </div>
    </div>
  );
};

export default ConfirmApprove;
  