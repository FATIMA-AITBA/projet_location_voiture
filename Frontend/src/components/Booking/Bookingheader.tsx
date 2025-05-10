import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';



const BookingHeader = ({ total }: { total: number }) => {
  return (
    <div className="w-full bg-gray-100 p-6 flex items-center shadow-md font-poppins">
      {/* Bouton retour */}
      <button className="mr-4 p-2 rounded-full hover:bg-gray-200 transition">
        <FaArrowLeft className="text-xl text-gray-700" />
      </button>

      {/* Texte principal */}
      <div className="text-xl font-semibold text-gray-800">
        Revoir votre réservation
      </div>

      {/* Total à droite */}
      <div className="ml-auto flex items-center space-x-4">
        <label htmlFor="total-price" className="font-medium text-sm text-gray-700">Total:</label>
        <input
          id="total-price"
          type="text"
          value={`${total.toFixed(2)} MAD`}
          readOnly
          className="text-lg font-bold text-right bg-transparent border-none focus:ring-0 text-gray-900"
        />
      </div>
    </div>
  );
};

export default BookingHeader;
