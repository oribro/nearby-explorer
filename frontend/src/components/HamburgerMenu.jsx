import React, { useState } from "react";

export default function HamburgerMenu({ user, onLogout, onShowFavourites, onShowHistory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div className="w-6 h-0.5 bg-gray-600"></div>
          <div className="w-6 h-0.5 bg-gray-600"></div>
          <div className="w-6 h-0.5 bg-gray-600"></div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute -right-65 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[9999]">
          <div className="py-2">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              {user?.email}
            </div>
            <button 
              onClick={onShowFavourites}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              ❤️ Favourites
            </button>
            <button 
              onClick={onShowHistory}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              📜 History
            </button>
            <hr className="my-1" />
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}