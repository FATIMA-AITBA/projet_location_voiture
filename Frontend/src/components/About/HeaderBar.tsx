import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGlobe, FaUser, FaPen } from 'react-icons/fa';
import FormPopup from "./FormPopup";
import logo from "../../../public/images/logo.png";
import { FaArrowLeft } from "react-icons/fa";

interface HeaderBarProps {
  lieuRetrait: string;
  lieuRetour: string;
  dateDepart: string;
  dateRetour: string;
  carFilter: any[];
  carList: any[];
  setCarList: React.Dispatch<React.SetStateAction<any[]>>;
  reservationList: any[];
}

export default function HeaderBar({
  lieuRetrait,
  lieuRetour,
  dateDepart,
  dateRetour,
  carFilter,
  carList,
  setCarList,
  reservationList
}: HeaderBarProps) {

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [user, setUser] = useState<{ nom: string; type: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erreur de parsing utilisateur", error);
      }
    }
  }, []);

  const handleNewSearch = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <header className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center shadow-md relative">
        {/* Conteneur avec flèche + logo */}
  <div className="flex items-center gap-2">
    <Link to="/" className="text-black-500 hover:text-blue-700 text-xl">
      <FaArrowLeft />
    </Link>
    <img src={logo} alt="Logo" width={100} className="brightness-0 invert mt-2 ml-2" />
  </div>

        {/* Lieu et dates */}
        <div className="w-[500px] bg-gray-800 text-white px-4 py-2 rounded-full flex items-center justify-between shadow-md">
          <div className="text-sm">
            <div className="text-lg font-semibold">
              {lieuRetrait} – {lieuRetour !== "null" ? lieuRetour : lieuRetrait}
            </div>
            <div className="text-sm text-gray-300">
              {dateDepart} – {dateRetour}
            </div>
          </div>
          <button onClick={handleNewSearch} className="text-gray-400 hover:text-white mr-3">
            <FaPen size={20} />
          </button>
        </div>

        {/* Langue et compte utilisateur */}
        <div className="flex items-center gap-4 text-sm relative">
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
            <FaGlobe size={12} />
            FR | €
          </div>

          {user ? (
            <div className="relative">
              <span
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1 cursor-pointer hover:text-gray-300"
              >
                <FaUser size={12} /> Bonjour, {user.nom}
              </span>
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white text-black shadow-lg rounded-md py-2 z-50 w-48">
                  <button
                    onClick={() => navigate("/reservations")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Réservation
                  </button>
                  <button
                    onClick={() => navigate("/donnees-personnelles")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Données personnelles
                  </button>
                  <button
                    onClick={() => navigate(user.type === "client" ? "/client_profile" : "/agence_profile")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => navigate("/aide")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Aide
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <span
                onClick={() => setShowLoginOptions(!showLoginOptions)}
                className="flex items-center gap-1 cursor-pointer hover:text-gray-300"
              >
                <FaUser size={12} />
                Connexion | Inscription
              </span>
              {showLoginOptions && (
                <div className="absolute right-0 top-10 bg-white text-black shadow-md rounded-md w-48 z-50">
                  <Link
                    to="/login_client"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    En tant que client
                  </Link>
                  <Link
                    to="/login_agence"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    En tant qu’agence
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* FormPopup */}
      {showForm && (
        <FormPopup
          handleCloseForm={handleCloseForm}
          carFilter={carFilter}
          carList={carList}
          setCarList={setCarList}
          reservationList={reservationList}
        />
      )}
    </>
  );
}
