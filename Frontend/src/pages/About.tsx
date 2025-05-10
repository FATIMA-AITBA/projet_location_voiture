import { useState, useEffect } from "react";
import FilterSection from "../components/About/FilterSection";
import GalerieSection from "../components/About/GalerieSection";
import { useLocation } from "react-router-dom";
import ErrorFirstFilter from "../components/About/ErrorFirstFilter";
import ErrorSecondFilter from "../components/About/ErrorSecondFilter";
import HeaderBar from "../components/About/HeaderBar";
import Footer from "../components/Utils/Footer";

interface LocationState {
  carList: any[];
  carFilter: any[];
  selectedLieuRetrait: string;
  selectedLieuRetour: string;
  selectedDateDepart: string;
  selectedDateRetour: string;
  reservationList: any[];
}

export default function About() {
  const location = useLocation<LocationState>();
  const [carList, setCarList] = useState<any[]>([]);
  const [carFilter, setCarFilter] = useState<any[]>([]);
  const [lieuRetrait, setLieuRetrait] = useState<string>("");
  const [lieuRetour, setLieuRetour] = useState<string>("");
  const [firstSearchDone, setFirstSearchDone] = useState(false);

  const [dateDepart, setDateDepart] = useState<string>("");
  const [dateRetour, setDateRetour] = useState<string>("");

  const [reservationList, setReservationList] = useState<any[]>([]);

  const [differenceEnJours, setDifferenceEnJours] = useState<number>(0);

  useEffect(() => {
    const initialCarList = location.state?.carList || [];
    const initialCarFilter = location.state?.carFilter || [];
    const initialLieuRetrait = location.state?.selectedLieuRetrait || "";
    const initialLieuRetour = location.state?.selectedLieuRetour || "";

    const initialDateDepart = location.state?.selectedDateDepart || "";
    const initialDateRetour = location.state?.selectedDateRetour || "";

    const initialReservationList = location.state?.reservationList || [];

    setCarList(initialCarList);
    setCarFilter(initialCarFilter);
    setLieuRetrait(initialLieuRetrait);
    setLieuRetour(initialLieuRetour);

    setDateDepart(initialDateDepart);
    setDateRetour(initialDateRetour);

    setReservationList(initialReservationList);
  }, [location.state]);

  useEffect(() => {
    if (dateDepart && dateRetour) {
      const daysDifference = calculateDaysDifference(dateDepart, dateRetour);
      setDifferenceEnJours(daysDifference);
    }
  }, [dateDepart, dateRetour]);

  const calculateDaysDifference = (dateDepart: string, dateRetour: string): number => {
    const departDate = new Date(dateDepart + "T00:00:00Z"); // Ajout de l'heure pour être plus précis
    const retourDate = new Date(dateRetour + "T00:00:00Z"); // Ajout de l'heure pour être plus précis

    if (isNaN(departDate.getTime()) || isNaN(retourDate.getTime())) {
      console.error("Erreur de conversion de date.");
      return NaN; // Si la conversion échoue, retourner NaN
    }

    const timeDifference = retourDate.getTime() - departDate.getTime(); // Différence en millisecondes
    const dayDifference = timeDifference / (1000 * 3600 * 24); // Convertir en jours

    return dayDifference; // Renvoie le nombre de jours
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeaderBar
          lieuRetrait={lieuRetrait}
          lieuRetour={lieuRetour}
          dateDepart={dateDepart}
          dateRetour={dateRetour}
          carFilter={carFilter}
          carList={carList}
          setCarList={setCarList}
          reservationList={reservationList}
        />
        <FilterSection
          carFilter={carFilter}
          carList={carList}
          setCarList={setCarList}
          setLieuRetrait={setLieuRetrait}
          lieuRetrait={lieuRetrait}
          setLieuRetour={setLieuRetour}
          lieuRetour={lieuRetour}
          firstSearchDone={firstSearchDone}
          setFirstSearchDone={setFirstSearchDone}
          dateDepart={dateDepart}
          dateRetour={dateRetour}
          reservationList={reservationList}
        />

        {carList.length === 0 ? (
          firstSearchDone ? (
            <ErrorFirstFilter
              carFilter={carFilter}
              carList={carList}
              setCarList={setCarList}
              reservationList={reservationList}
            />
          ) : (
            <ErrorSecondFilter />
          )
        ) : (
          <GalerieSection carList={carList} differenceEnJours={differenceEnJours} dateDepart={dateDepart}
          dateRetour={dateRetour} />
        )}
      </main>
      <Footer />
    </div>
  );
}
