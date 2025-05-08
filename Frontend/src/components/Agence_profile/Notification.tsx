import React from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded shadow-lg text-white transition-opacity duration-300 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="text-white font-bold">×</button>
      </div>
    </div>
  );
};

export default Notification;
