import { useState, useEffect } from "react";
import {
  FaGasPump, FaCarSide, FaChevronDown, FaCarAlt, FaCar, FaTruck ,FaShuttleVan
} from "react-icons/fa";
import { MdElectricCar } from "react-icons/md";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import {
  TbManualGearboxFilled,
  TbSquareLetterAFilled,
  TbCarSuvFilled,
  TbSortDescendingNumbers,
  TbSortAscendingNumbers
} from "react-icons/tb";
import {
  SiAudi, SiMercedes, SiPeugeot, SiRenault, SiToyota,
  SiVolkswagen, SiBmw, SiFiat, SiFord, SiJeep, SiHonda,SiNissan, SiMazda, SiHyundai, SiKia,SiVolvo,SiCadillac,SiMitsubishi,SiJaguar,SiDacia
} from "react-icons/si";
import { IoDiamondOutline } from "react-icons/io5";
import cn from "classnames";

type Car = {
  id: string;
  marque: string;
  fuelType: string;
  typeBoite: string;
  carType: string;
  lieuDeRetrait: string;
  lieuDeRetour: string;
  prixParJour: number;
  places: number;
};

type Reservation = {
  carList: Car;
  dateDeDepart: string;
  dateDeRetour: string;
};

type FilterSectionProps = {
  carFilter: Car[];
  carList: Car[];
  setCarList: (cars: Car[]) => void;
  setLieuRetrait: (lieu: string) => void;
  lieuRetrait: string;
  setLieuRetour: (lieu: string) => void;
  lieuRetour: string;
  firstSearchDone: boolean;
  setFirstSearchDone: (val: boolean) => void;
  dateDepart: string;
  dateRetour: string;
  reservationList: Reservation[];
};

export default function FilterSection({
  carFilter, carList, setCarList, setLieuRetrait,
  lieuRetrait, setLieuRetour, lieuRetour,
  firstSearchDone, setFirstSearchDone,
  dateDepart, dateRetour, reservationList
}: FilterSectionProps) {
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [priceOrder, setPriceOrder] = useState<number | null>(null);
  /*const [brandList, setBrandList] = useState<string[]>([]);*/
  const brandList: string[] = [
  'Audi', 'Mercedes', 'Dacia', 'Peugeot', 'Renault', 'Toyota', 'VW', 'BMW',
  'Fiat', 'Ford', 'Jeep', 'Honda', 'Nissan', 'Mazda', 'Hyundai', 'Kia',
  'Volvo', 'Cadillac', 'Mitsubishi', 'Jaguar'
];
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  /*const [fuelList, setFuelList] = useState<string[]>([]);*/
 const fuelList: string[] = ['Essence', 'Diesel', 'Electrique', 'Hybride'];
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFuel, setIsOpenFuel] = useState(false);
  const [isOpenCar, setIsOpenCar] = useState(false);
  const [selectedTypeBoite, setSelectedTypeBoite] = useState<string[]>([]);
  /*const [typeBoiteList, setTypeBoiteList] = useState<string[]>([]);*/
  const typeBoiteList: string[] = ['Automatique', 'Manuelle'];
  const [selectedTypeCar, setSelectedTypeCar] = useState<string[]>([]);
  /*const [typeCarList, setTypeCarList] = useState<string[]>([]);*/
  const typeCarList: string[] = ["Berline", "SUV", "Coupe", "Cabriolet", "Minivan", "Break","Citadine", "Véhicule de luxe","Utilitaire","Familiale"];
  const [selectedPlaces, setSelectedPlaces] = useState<number | null>(null);

  /*const BrandSet = new Set<string>();*/
  /*const FuelSet = new Set<string>();*/
  /*const TypeBoiteSet = new Set<string>();*/
  /*const TypeCarSet = new Set<string>();*/

  

  const iconMap: Record<string, JSX.Element> = {
    //tpye de carburant
    Essence: <FaGasPump size={24} />,
    Diesel: <BsFillFuelPumpDieselFill size={24} />,
    Electrique: <MdElectricCar size={24} />,
    Hybride: <FaCarSide size={24} />,
    //type de boite
    Automatique: <TbSquareLetterAFilled size={24} />,
    Manuelle: <TbManualGearboxFilled size={24} />,
    // marque(brand) de voiture
    Audi: <SiAudi size={58} />,
    Mercedes: <SiMercedes size={58} />,
    Dacia: <SiDacia size={58} />, // Fallback icon for Dacia
    Peugeot: <SiPeugeot size={58} />,
    Renault: <SiRenault size={58} />,
    Toyota: <SiToyota size={58} />,
    VW: <SiVolkswagen size={58} />,
    BMW: <SiBmw size={58} />,
    Fiat: <SiFiat size={58} />,
    Ford: <SiFord size={58} />,
    Jeep: <SiJeep size={58} />,
    Honda: <SiHonda size={58} />,
    Nissan: <SiNissan size={58} />,
    Mazda: <SiMazda size={58} />,
    Hyundai: <SiHyundai size={58} />,
    Kia: <SiKia size={58} />,
    Volvo: <SiVolvo size={58} />,
    Cadillac: <SiCadillac size={58} />,
    Mitsubishi: <SiMitsubishi size={58} />,
    Jaguar: <SiJaguar size={58} />,
    
    //type de voiture
    Berline: <FaCarSide size={24} />,
    SUV: <TbCarSuvFilled size={24} />,
    Coupe: <FaCarAlt size={24} />,
    Cabriolet: <FaCar size={24} />,
    Minivan: <FaShuttleVan size={24} />,
    break: <FaShuttleVan size={24} />,
    "Utilitaire": <FaTruck size={24} />,
    "Véhicule de luxe": <IoDiamondOutline size={24} />,
    
  };

  
  /*useEffect(() => {
    if (carFilter) {
      handlerFilter();
    }
  }, [carFilter]);*/

  useEffect(() => {
    if (lieuRetrait) {
      filterLieu(lieuRetrait, lieuRetour);
  
    if (dateDepart && dateRetour) {
        filterDate(dateDepart, dateRetour);
      }
    }
  }, [lieuRetrait, lieuRetour, dateDepart, dateRetour]);
  

  /*const handlerFilter = () => {
    carFilter.forEach((element: any) => {
      BrandSet.add(element.marque);
      FuelSet.add(element.fuelType);
      TypeBoiteSet.add(element.typeBoite);
      TypeCarSet.add(element.carType);
    });
  
    setBrandList(Array.from(BrandSet));
    setFuelList(Array.from(FuelSet));
    setTypeBoiteList(Array.from(TypeBoiteSet));
    setTypeCarList(Array.from(TypeCarSet));
  };*/
  

  
  const filterPrice = (order: any) => {
    setFirstSearchDone(false);
    const parsedOrder = order === "null" ? null : Number(order);
    setPriceOrder(parsedOrder);
    applyFilters(selectedBrand.length === 0 ? null : selectedBrand, parsedOrder, lieuRetrait, selectedFuel, selectedTypeBoite, selectedTypeCar, selectedPlaces,lieuRetour,dateDepart,dateRetour);
  };

  const filterLieu = (lieuRetrait: string,lieuRetour :string) => {
    setFirstSearchDone(true);
    applyFilters(selectedBrand, priceOrder, lieuRetrait === "Toutes" ? null : lieuRetrait, selectedFuel, selectedTypeBoite, selectedTypeCar, selectedPlaces,lieuRetour,dateDepart,dateRetour);
  };


  const filterCardList = (brand: string) => {
    setFirstSearchDone(false);
    let updatedBrands = [...selectedBrand];
  
    if (updatedBrands.includes(brand)) {
      updatedBrands = updatedBrands.filter((b) => b !== brand);
    } else {
      updatedBrands.push(brand);
    }
  
    setSelectedBrand(updatedBrands);
    applyFilters(
      updatedBrands.length === 0 ? null : updatedBrands,
      priceOrder,
      lieuRetrait,
      selectedFuel,
      selectedTypeBoite,
      selectedTypeCar,
      selectedPlaces,
      lieuRetour,
      dateDepart,
      dateRetour
    );
  };

  const filterFuel = (fuel: string) => {
    setFirstSearchDone(false);
    let updatedFuels = [...selectedFuel];
  
    if (updatedFuels.includes(fuel)) {
      updatedFuels = updatedFuels.filter((f) => f !== fuel);
    } else {
      updatedFuels.push(fuel);
    }
  
    setSelectedFuel(updatedFuels);
    applyFilters(
      selectedBrand,
      priceOrder,
      lieuRetrait,
      updatedFuels.length === 0 ? null : updatedFuels,
      selectedTypeBoite,
      selectedTypeCar,
      selectedPlaces,
      lieuRetour,
      dateDepart,
      dateRetour
    );
  };
  

  const filterTypeBoite = (typeBoite: string) => {
    setFirstSearchDone(false);
    let updatedTypeBoite = [...selectedTypeBoite];
  
    if (updatedTypeBoite.includes(typeBoite)) {
      updatedTypeBoite = updatedTypeBoite.filter((t) => t !== typeBoite);
    } else {
      updatedTypeBoite.push(typeBoite);
    }
  
    setSelectedTypeBoite(updatedTypeBoite);
    applyFilters(
      selectedBrand,
      priceOrder,
      lieuRetrait,
      selectedFuel,
      updatedTypeBoite.length === 0 ? null : updatedTypeBoite,
      selectedTypeCar,
      selectedPlaces,
      lieuRetour,
      dateDepart,
      dateRetour
    );
  };

  const filterTypeCar = (typeCar: string) => {
    setFirstSearchDone(false);
    let updatedTypeCar = [...selectedTypeCar];
  
    if (updatedTypeCar.includes(typeCar)) {
      updatedTypeCar = updatedTypeCar.filter((t) => t !== typeCar);
    } else {
      updatedTypeCar.push(typeCar);
    }
  
    setSelectedTypeCar(updatedTypeCar);
    applyFilters(
      selectedBrand,
      priceOrder,
      lieuRetrait,
      selectedFuel,
      selectedTypeBoite,
      updatedTypeCar.length === 0 ? null : updatedTypeCar,
      selectedPlaces,
      lieuRetour,
      dateDepart,
      dateRetour
    );
  };
  
  const filterPlaces = (places: number | null) => {
    setFirstSearchDone(false);
  const parsedPlaces = isNaN(places) ? null : places;
  setSelectedPlaces(parsedPlaces);

  applyFilters(
    selectedBrand,
    priceOrder,
    lieuRetrait,
    selectedFuel,
    selectedTypeBoite,
    selectedTypeCar,
    parsedPlaces,
    lieuRetour,
    dateDepart,
    dateRetour
  );
};

const filterDate = (dateDepart: string, dateRetour: string) => {
  setFirstSearchDone(true);
  applyFilters(
    selectedBrand,
    priceOrder,
    lieuRetrait,
    selectedFuel,
    selectedTypeBoite,
    selectedTypeCar,
    selectedPlaces,
    lieuRetour,
    dateDepart,
    dateRetour
   
  );
};


  const applyFilters = (brand: string[] | null, order: any | null, lieuRetrait: string | null, fuel: string[] | null, typeBoite: string[] | null, typeCar: string[] | null, places: number | null, lieuRetour: string | null, dateDepart: string | null, dateRetour: string | null ) => {
    let filtered = [...carFilter];
    if (lieuRetrait && lieuRetour !== "null") {
      filtered = filtered.filter((item: any) => item.lieuDeRetrait === lieuRetrait && item.lieuDeRetour === lieuRetour);
    }else if (lieuRetour=="null"){
      filtered = filtered.filter((item: any) => item.lieuDeRetrait === lieuRetrait && item.lieuDeRetour === lieuRetrait);
    }

    if (brand && brand.length > 0) {
      filtered = filtered.filter((item: any) => brand.includes(item.marque));
    }
    if (fuel && fuel.length > 0) {
      filtered = filtered.filter((item: any) => fuel.includes(item.fuelType));
    }
    if (typeBoite && typeBoite.length > 0) {
      filtered = filtered.filter((item: any) => typeBoite.includes(item.typeBoite));
    }
    if (typeCar && typeCar.length > 0) {
      filtered = filtered.filter((item: any) => typeCar.includes(item.carType));
    }
    if (places) {
      filtered = filtered.filter((item: any) => item.places >= places);
    }
    if (order) {
      filtered = filtered.sort((a, b) =>
        order == -1 ? a.prixParJour - b.prixParJour : b.prixParJour - a.prixParJour
      );
    }
    


    // 1. Vérification des disponibilités
    if (dateDepart && dateRetour) {
      filtered = filtered.filter((car: any) => {
        const isReserved = reservationList.some((reservation: any) => {
          return reservation.carList.id === car.id && (
            // Cas où les dates se chevauchent
            (new Date(dateDepart) >= new Date(reservation.dateDeDepart) && new Date(dateDepart) <= new Date(reservation.dateDeRetour)) ||
            (new Date(dateRetour) >= new Date(reservation.dateDeDepart) && new Date(dateRetour) <= new Date(reservation.dateDeRetour)) ||
            (new Date(dateDepart) <= new Date(reservation.dateDeDepart) && new Date(dateRetour) >= new Date(reservation.dateDeRetour))
          );
        });
        return !isReserved; // garder les voitures non réservées sur cet intervalle
      });
    }
    


    setCarList(filtered);
  };



  return (
    <div className="bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 p-4">

        {/* Menu déroulant pour sélectionner l ordre du  prix */}
        <select onChange={(e) => filterPrice(e.target.value)} className="select select-bordered  w-full sm:w-1/3 md:w-1/5 lg:w-1/6 h-14">
            <option disabled selected>
            Trier par prix
            </option >
            <option value="null">par défaut</option>
            <option value={-1}>Par prix croissant</option>
            <option value={1}>Par prix décroissant</option>
        </select>

        {/* Menu déroulant pour sélectionner le nombre de places */}
        <select onChange={(e) => filterPlaces(Number(e.target.value))} className="select select-bordered w-full sm:w-1/3 md:w-1/5 lg:w-1/6 h-14">
          <option disabled selected>
            Nombre de places
          </option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
          <option value="6">6+</option>
          <option value="7">7+</option>
       </select>

       
      {/* Menu déroulant pour sélectionner le type de boite */}
        <div className="w-full sm:w-1/3 md:w-1/5 lg:w-1/6 h-14">
        <div className="relative w-full h-full">
            <button
            className="w-full h-full flex justify-between px-4 py-2 text-sm font-medium text-black bg-white rounded-lg shadow hover:opacity-90 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            >
            <span>
                Type de boite
                {selectedTypeBoite.length > 0 && (
                <span className="ml-1">({selectedTypeBoite.length})</span>
                )}
            </span>
            <FaChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {isOpen && (
            <div className="absolute mt-2 w-[240px] rounded-xl bg-white shadow-2xl z-50 py-2 space-y-2">
                {typeBoiteList
                .filter((item: string) => item !== "Toutes")
                .map((item: string, index: number) => {
                    const isSelected = selectedTypeBoite.includes(item);
                    return (
                    <label
                        key={index}
                        className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all",
                        isSelected
                            ? "bg-zinc-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-black"
                        )}
                        onClick={() => filterTypeBoite(item)}
                    >
                        <div className="text-xl">{iconMap[item]}</div>
                        <span>{item}</span>
                    </label>
                    );
                })}
            </div>
            )}
        </div>
        </div>

         {/* Menu déroulant pour sélectionner le type de voiture */}
        <div className="w-full sm:w-1/3 md:w-1/5 lg:w-1/6 h-14">
        <div className="relative w-full h-full">
            <button
            className="w-full h-full flex justify-between px-4 py-2 text-sm font-medium text-black bg-white rounded-lg shadow hover:opacity-90 focus:outline-none"
            onClick={() => setIsOpenCar(!isOpenCar)}
            >
            <span>
                Type de véhicule
                {selectedTypeCar.length > 0 && (
                <span className="ml-1">({selectedTypeCar.length})</span>
                )}
            </span>
            <FaChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {isOpenCar && (
            <div className="absolute mt-2 w-[240px] rounded-xl bg-white shadow-2xl z-50 py-2 space-y-2">
                {typeCarList
                .filter((item: string) => item !== "Toutes")
                .map((item: string, index: number) => {
                    const isSelected = selectedTypeCar.includes(item);
                    return (
                    <label
                        key={index}
                        className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all",
                        isSelected
                            ? "bg-zinc-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-black"
                        )}
                        onClick={() => filterTypeCar(item)}
                    >
                        <div className="text-xl">{iconMap[item]}</div>
                        <span>{item}</span>
                    </label>
                    );
                })}
            </div>
            )}
        </div>
        </div>


        {/* Menu déroulant pour sélectionner le carburant */}
    <div className="w-full sm:w-1/3 md:w-1/5 lg:w-1/6 h-14">
    <div className="relative w-full h-full">
        <button
        className="w-full h-full flex justify-between px-4 py-2 text-sm font-medium text-black bg-white rounded-lg shadow hover:opacity-90 focus:outline-none"
        onClick={() => setIsOpenFuel(!isOpenFuel)}
        >
        <span>
            Type de carburant
            {selectedFuel.length > 0 && (
            <span className="ml-1">({selectedFuel.length})</span>
            )}
        </span>
        <FaChevronDown className="h-4 w-4 opacity-60" />
        </button>

        {isOpenFuel && (
        <div className="absolute mt-2 w-[240px] rounded-xl bg-white shadow-2xl z-50 py-2 space-y-2">
            {fuelList
            .filter((item: string) => item !== "Toutes")
            .map((item: string, index: number) => {
                const isSelected = selectedFuel.includes(item);
                return (
                <label
                    key={index}
                    className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all",
                    isSelected
                        ? "bg-zinc-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-black"
                    )}
                    onClick={() => filterFuel(item)}
                >
                    <div className="text-xl">{iconMap[item]}</div>
                    <span>{item}</span>
                </label>
                );
            })}
        </div>
        )}
    </div>
    </div>
    </div>




    {/* Liste des marques */}
<div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:flex lg:flex-row lg:justify-center lg:gap-3 p-4 rounded-lg">
  {brandList
    .filter((item: string) => item !== "Toutes")
    .map((item: string, index: number) => {
      const isSelected = selectedBrand.includes(item);
      const icon = iconMap[item]; // on récupère l’icône correspondante

      return (
        <div key={index} className="flex flex-col items-center">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => filterCardList(item)}
              className="hidden"
            />
            <div
              className={`w-16 h-16 flex items-center justify-center bg-white rounded shadow-md transition ${
                isSelected ? "opacity-45" : ""
              }`}
            >
              {icon}
            </div>
          </label>
        </div>
      );
    })}
</div>


    </div>
  );
}