"use client"; // Obligatoire pour l'utilisation de hooks ou d'interactivité

import React from 'react';

type BookingFooterProps = {
  onSubmit: () => void;
  total: string;
};


const BookingFooter: React.FC<BookingFooterProps>  = ( { onSubmit ,total }) => {
  return (
    <div className="w-full bg-gray-100 p-6 space-y-6">
      {/* Total avec prix aligné à droite */}
      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total</span>
        <input
            id="total-price-footer"
            type="text"
            value={`${total} MAD`}
            readOnly
            className="text-lg font-bold text-right bg-transparent border-none focus:ring-0"
        />
    </div>

      {/* Liens */}
    <div className="space-y-2">
        <a href="#" className="text-blue-600 hover:underline block">Détails de prix</a>
        <a href="#" className="text-blue-600 hover:underline block">Informations importantes concernant votre réservation</a>
      </div>

      {/* Texte d'acceptation */}
      <div>
        <p className="text-sm">
          J'ai lu et j'accepte les <span className="underline cursor-pointer">Informations sur la location</span>, les <span className="underline cursor-pointer">Conditions générales</span> et la <span className="underline cursor-pointer">Politique de confidentialité</span> et je reconnais que je réserve un tarif prépayé, pour lequel l'intégralité du prix de la réservation est immédiatement débité du moyen de paiement fourni.
        </p>
      </div>

      {/* Bouton réserver */}
      <div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          onClick={onSubmit}>
          Réserver
        </button>
      </div>
    </div>
  );
};

export default BookingFooter;
