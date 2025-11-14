import React, { useEffect } from "react";

export default function Toast({ message, type = "info", onClose, className = "" }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const defaultClass = className || "fixed top-4 right-4 z-[9999]";

  return (
    <div className={`${defaultClass} ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">×</button>
    </div>
  );
}