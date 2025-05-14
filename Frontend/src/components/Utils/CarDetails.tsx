import { AiOutlineClose } from "react-icons/ai";
import { FaSuitcase, FaCarSide, FaCogs, FaDoorOpen, FaUser } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { GiCarDoor } from "react-icons/gi";
import { BsSuitcase2Fill } from "react-icons/bs";
import { TbManualGearboxFilled, TbSquareLetterAFilled } from "react-icons/tb";
import CarOptions from "./CarOptions";

// Définition du type pour les props
interface Car {
  id: number;
  name: string;
  image: { url: string };
  places: number;
  typeBoite: "automatique" | "manuelle";
  marque: string;
  kilometrageInclus: number;
  prixParJour: number;
  tarifKmSupp: number;
  tarifKmIlimitesParJour: number;
}


interface CarDetailsProps {
  car: Car;
  onBack: () => void;
  differenceEnJours: number;
  dateDepart: string;
  dateRetour: string;
}

export default function CarDetails({ car, onBack, differenceEnJours,dateDepart,dateRetour }: CarDetailsProps) {
  return (
    <div className="bg-[#e1e3e4] p-2 rounded-xl ">
      <div className=" text-black rounded-xl shadow-2xl w-full ">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Colonne image */}
          <div className="relative bg-gradient-to-b from-[#1a1a1a] via-gray-500 to-[#1a1a1a] rounded-tl-xl rounded-bl-xl shadow-md md:w-1/2 w-full flex flex-col justify-between min-h-[60px]">

            {/* Titre en haut positionné absolument */}
            <div className="absolute top-2 left-0 text-white px-3 py-1 font-semibold text-3xl m-3">
              {car.name}
            </div>

            {/* Un spacer pour compenser l'absolu */}
            <div className="pt-16" />

            {/* Image centrée verticalement */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={car.image?.url}
                alt={car.name}
                className="max-w-full max-h-[300px] object-contain rounded-md"
              />
            </div>

            {/* Conteneur des infos en bas */}
            <div className="flex items-center justify-center py-4 gap-x-12 text-white mb-5">
              <div className="flex items-center gap-2">
                <MdAirlineSeatReclineNormal className="text-2xl mb-1" />
                <span>{car.places} Sièges</span>
              </div>
              <div className="flex items-center gap-2">
                <BsSuitcase2Fill className="text-xl" />
                <span>2 Valise(s)</span>
              </div>
              <div className="flex items-center gap-2">
                {car.typeBoite === "automatique" ? (
                  <TbSquareLetterAFilled className="text-xl" />
                ) : (
                  <TbManualGearboxFilled className="text-xl" />
                )}
                <span>{car.typeBoite}</span>
              </div>
              <div className="flex items-center gap-2">
                <GiCarDoor className="text-xl" />
                <span>4 Portes</span>
              </div>
            </div>
          </div>

          {/* Colonne infos */}
          <div className="relative bg-white md:w-1/2 w-full rounded-tr-xl rounded-br-xl p-4">
            <button
              onClick={onBack}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
            >
              <AiOutlineClose />
            </button>

            <CarOptions car={car} differenceEnJours={differenceEnJours}    dateDepart={dateDepart}
                    dateRetour={dateRetour} />
          </div>
        </div>
      </div>
    </div>
  );
}

