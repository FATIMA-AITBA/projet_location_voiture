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
  SiVolkswagen, SiBmw, SiFiat, SiFord, SiJeep, SiHonda,SiNissan, SiMazda, SiHyundai, SiKia,SiVolvo,SiCadillac,SiMitsubishi,SiJaguar
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
  const [brandList, setBrandList] = useState<string[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  /*const [fuelList, setFuelList] = useState<string[]>([]);*/
 const fuelList: string[] = ['essence', 'diesel', 'electrique', 'hybride'];
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFuel, setIsOpenFuel] = useState(false);
  const [isOpenCar, setIsOpenCar] = useState(false);
  const [selectedTypeBoite, setSelectedTypeBoite] = useState<string[]>([]);
  /*const [typeBoiteList, setTypeBoiteList] = useState<string[]>([]);*/
  const typeBoiteList: string[] = ['automatique', 'manuel'];
  const [selectedTypeCar, setSelectedTypeCar] = useState<string[]>([]);
  /*const [typeCarList, setTypeCarList] = useState<string[]>([]);*/
  const typeCarList: string[] = ["berline", "suv", "coupe", "cabriolet", "minivan", "break", "Véhicule de luxe","Véhicule utilitaire","voiture familiale"];
  const [selectedPlaces, setSelectedPlaces] = useState<number | null>(null);

  const BrandSet = new Set<string>();
  /*const FuelSet = new Set<string>();*/
  /*const TypeBoiteSet = new Set<string>();*/
  /*const TypeCarSet = new Set<string>();*/

  

  const iconMap: Record<string, JSX.Element> = {
    //tpye de carburant
    essence: <FaGasPump size={24} />,
    diesel: <BsFillFuelPumpDieselFill size={24} />,
    electrique: <MdElectricCar size={24} />,
    hybride: <FaCarSide size={24} />,
    //type de boite
    automatique: <TbSquareLetterAFilled size={24} />,
    manuel: <TbManualGearboxFilled size={24} />,
    // marque(brand) de voiture
    audi: <SiAudi size={58} />,
    mercedes: <SiMercedes size={58} />,
    peugeot: <SiPeugeot size={58} />,
    renault: <SiRenault size={58} />,
    toyota: <SiToyota size={58} />,
    vw: <SiVolkswagen size={58} />,
    bmw: <SiBmw size={58} />,
    fiat: <SiFiat size={58} />,
    ford: <SiFord size={58} />,
    jeep: <SiJeep size={58} />,
    honda: <SiHonda size={58} />,
    nissan: <SiNissan size={58} />,
    mazda: <SiMazda size={58} />,
    hyundai: <SiHyundai size={58} />,
    kia: <SiKia size={58} />,
    volvo: <SiVolvo size={58} />,
    cadillac: <SiCadillac size={58} />,
    mitsubishi: <SiMitsubishi size={58} />,
    jaguar: <SiJaguar size={58} />,
    
    //type de voiture
    berline: <FaCarSide size={24} />,
    suv: <TbCarSuvFilled size={24} />,
    coupe: <FaCarAlt size={24} />,
    cabriolet: <FaCar size={24} />,
    minivan: <FaShuttleVan size={24} />,
    break: <FaShuttleVan size={24} />,
    "Véhicule utilitaire": <FaTruck size={24} />,
    "Véhicule de luxe": <IoDiamondOutline size={24} />,
    
  };

  
  useEffect(() => {
    if (carFilter) {
      handlerFilter();
    }
  }, [carFilter]);

  useEffect(() => {
    if (lieuRetrait) {
      filterLieu(lieuRetrait, lieuRetour);
  
    if (dateDepart && dateRetour) {
        filterDate(dateDepart, dateRetour);
      }
    }
  }, [lieuRetrait, lieuRetour, dateDepart, dateRetour]);
  

  const handlerFilter = () => {
    carFilter.forEach((element: any) => {
      BrandSet.add(element.marque);
      /*FuelSet.add(element.fuelType);*/
      /*TypeBoiteSet.add(element.typeBoite);*/
      /*TypeCarSet.add(element.carType);*/
    });
  
    setBrandList(Array.from(BrandSet));
    /*setFuelList(Array.from(FuelSet));*/
    /*setTypeBoiteList(Array.from(TypeBoiteSet));*/
    /*setTypeCarList(Array.from(TypeCarSet));*/
  };
  

  
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
      <div className="flex flex-row justify-center gap-16 p-4">

        {/* Menu déroulant pour sélectionner l ordre du  prix */}
        <select onChange={(e) => filterPrice(e.target.value)} className="select select-bordered w-1/6 h-14">
            <option disabled selected>
            Trier par prix
            </option >
            <option value="null">par défaut</option>
            <option value={-1}>Par prix croissant</option>
            <option value={1}>Par prix décroissant</option>
        </select>

        {/* Menu déroulant pour sélectionner le nombre de places */}
        <select onChange={(e) => filterPlaces(Number(e.target.value))} className="select select-bordered w-1/6 h-14">
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
        <div className="w-1/6 h-14">
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
        <div className="w-1/6 h-14">
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
    <div className="w-1/6 h-14">
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
<div className="flex justify-center gap-4 p-4 rounded-lg">
  {brandList
    .filter((item: string) => item !== "Toutes")
    .map((item: string, index: number) => {
      const isSelected = selectedBrand.includes(item);
      const icon = iconMap[item.toLowerCase()]; // on récupère l’icône correspondante

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