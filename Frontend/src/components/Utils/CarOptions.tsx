import React, { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import InfoPopup from "./infoPopup";
import DetailPrixPopup from "./DetailPrixPopup";
import { useNavigate } from "react-router-dom";

// Types des props
interface Car {
  prixParJour: string | number;
  tarifKmSupp: number;
  kilometrageInclus: number;
  tarifKmIlimitesParJour: number;
}

interface CarOptionsProps {
  car: Car;
  differenceEnJours: number;
  dateDepart: string;
  dateRetour: string;
}

const CarOptions: React.FC<CarOptionsProps> = ({ car, differenceEnJours,dateDepart,dateRetour }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailPrix, setShowDetailPrix] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(car.prixParJour || "");
  const [kilometrageType, setKilometrageType] = useState<"limité" | "illimité">("limité");


  const navigate = useNavigate();
  const supplementLocal = 5;

  useEffect(() => {
    setSelectedValue(car.prixParJour || "");
  }, [car]);

  const togglePopup = () => setShowPopup((prev) => !prev);
  const closePopup = () => setShowPopup(false);

  const toggleDetailPrix = () => setShowDetailPrix((prev) => !prev);
  const closeDetailPrix = () => setShowDetailPrix(false);

 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setSelectedValue(value);

  // Vérifie si la valeur correspond à l’option illimitée
  const prixIllimite = parseFloat((+car.prixParJour + car.tarifKmIlimitesParJour).toFixed(2));
  if (parseFloat(value) === prixIllimite) {
    setKilometrageType("illimité");
  } else {
    setKilometrageType("limité");
  }
};

  const calculateMontantHT = (): number => {
    return parseFloat((parseFloat(selectedValue as string) * differenceEnJours).toFixed(2));
  };

  const calculateTVA = (): number => {
    const tauxTVA = 20;
    const montantHT = calculateMontantHT();
    return parseFloat(((montantHT * tauxTVA) / 100).toFixed(2));
  };

  const totalFrais = (): number => {
    const tva = calculateTVA();
    return parseFloat((tva + supplementLocal).toFixed(2));
  };

  const calculateTotal = (): number => {
    const montantHT = calculateMontantHT();
    const fraisPlusTVA = totalFrais();
    return parseFloat((montantHT + fraisPlusTVA).toFixed(2));
  };

  const handleNavigation = () => {
    navigate("/booking_page", {
      state: { total: calculateTotal() ,
        car: car ,
        differenceEnJours: differenceEnJours,
        dateDepart: dateDepart,
        dateRetour: dateRetour,
        kilometrageType: kilometrageType,
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl relative mt-2">
      <h2 className="text-lg font-semibold mb-4">Options de paiement</h2>

      <div className="border rounded-xl p-4 mb-6 flex justify-between items-center">
        <div>
          <p className="font-medium">Restez flexible</p>
          <p className="text-sm text-gray-500">
            Payez à la prise en charge, annulez et modifiez gratuitement avant l'heure de la prise en charge
          </p>
        </div>

        <span
          className="text-sm font-semibold flex items-center gap-1 cursor-pointer text-black hover:text-blue-600 transition-colors"
          onClick={togglePopup}
        >
          Inclus <AiOutlineInfoCircle size={24} />
        </span>
      </div>

      <h2 className="text-lg font-semibold mb-4">Kilométrage</h2>
      <div className="space-y-3">
        {/* Option avec kilométrage limité */}
        <label className="flex items-start border rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all">
          <input
            type="radio"
            name="kilometrage"
            value={car.prixParJour}
            className="mt-1 mr-3 accent-blue-600"
            onChange={handleChange}
            checked={selectedValue == car.prixParJour}
          />
          <div className="flex justify-between w-full">
            <div>
              <p className="font-medium">{car.kilometrageInclus} km</p>
              <p className="text-sm text-gray-500">
                +{car.tarifKmSupp} MAD / pour chaque kilomètre supplémentaire
              </p>
            </div>
            <span className="text-sm font-semibold self-start">Inclus</span>
          </div>
        </label>

        {/* Option avec kilomètres illimités */}
        <label className="flex items-start border rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-all">
          <input
            type="radio"
            name="kilometrage"
            value={parseFloat((+car.prixParJour + car.tarifKmIlimitesParJour).toFixed(2))}
            className="mt-1 mr-3 accent-blue-600"
            onChange={handleChange}
            checked={
              selectedValue ==
              parseFloat((+car.prixParJour + car.tarifKmIlimitesParJour).toFixed(2))
            }
          />
          <div className="flex justify-between w-full">
            <div>
              <p className="font-medium">Kilomètres illimités</p>
              <p className="text-sm text-gray-500">
                Tous les kilomètres sont inclus dans le prix
              </p>
            </div>
            <span className="text-sm font-semibold self-start">
              + {car.tarifKmIlimitesParJour} MAD par jour
            </span>
          </div>
        </label>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-lg font-semibold">
          <span>{selectedValue} MAD</span>
          <span className="text-sm text-gray-500"> / jour</span>
          <div className="text-sm text-gray-600">{calculateTotal()} MAD total</div>
        </div>
        <button
          onClick={handleNavigation}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 py-3 rounded-xl transition-all"
        >
          Réserver
        </button>
      </div>

      <div
        className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline"
        onClick={toggleDetailPrix}
      >
        Détails du prix
      </div>

      {/* POPUPS */}
      {showPopup && <InfoPopup onClose={closePopup} />}
      {showDetailPrix && (
        <DetailPrixPopup
          onClose={closeDetailPrix}
          differenceEnJours={differenceEnJours}
          selectedValue={selectedValue}
          montantHT={calculateMontantHT()}
          tva={calculateTVA()}
          supp={supplementLocal}
          frais={totalFrais()}
          total={calculateTotal()}
        />
      )}
    </div>
  );
};

export default CarOptions;
