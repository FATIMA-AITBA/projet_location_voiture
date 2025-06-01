import React from "react";

const TemoignagesClients: React.FC = () => {
  return (
    <section className="bg-black text-white py-16 px-4 text-center">
      <h5 className="text-yellow-500 uppercase tracking-wide text-sm font-semibold mb-2">
        Témoignages clients
      </h5>
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
        Ce Que Disent Nos Clients
      </h2>
      <p className="text-sm md:text-base text-gray-300 mb-12">
        Excellente expérience avec Loca voiture. Véhicule en parfait état et personnel très professionnel !
      </p>

      <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-24">
        {/* Témoignage 1 */}
        <div className="flex-1 max-w-sm text-left">
          <img
            src="/images/sara.webp"
            alt="Sara"
            className="w-24 h-24 mx-auto mb-4 rounded-full"
          />
          <p className="text-sm italic mb-2 text-gray-200 relative">
            <span className="text-yellow-500 text-4xl absolute -left-4 -top-2">“</span>
            Location facile et rapide. Je recommande vivement pour vos déplacements au Maroc.
            <span className="text-yellow-500 text-4xl ml-1">”</span>
          </p>
          <p className="font-bold text-lg text-center">Sara, Casablanca</p>
        </div>

        {/* Séparateur vertical */}
        <div className="hidden md:block h-40 border-l-2 border-blue-600"></div>

        {/* Témoignage 2 */}
        <div className="flex-1 max-w-sm text-left">
          <img
            src="/images/ahmed.webp"
            alt="Ahmed"
            className="w-24 h-24 mx-auto mb-4 rounded-full"
          />
          <p className="text-sm italic mb-2 text-gray-200 relative">
            <span className="text-yellow-500 text-4xl absolute -left-4 -top-2">“</span>
            Nous sommes fiers d’offrir un service de qualité et des véhicules adaptés à vos besoins.
            <span className="text-yellow-500 text-4xl ml-1">”</span>
          </p>
          <p className="font-bold text-lg text-center">Ahmed, Marrakech</p>
        </div>
      </div>
    </section>
  );
};

export default TemoignagesClients;
