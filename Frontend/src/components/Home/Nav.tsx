import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/images/logo.png";
import { IoMdMenu } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaCarAlt, FaCalendarAlt, FaAddressCard, FaUser, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";

interface MenuItem {
  name: string;
  icon: React.ComponentType;
}

const menu: MenuItem[] = [
  { name: "Gerer mes réservations", icon: FaCarAlt },
  { name: "FR | £", icon: TbWorld },
];

export default function Nav() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<{ nom: string; type: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erreur de parsing de l'utilisateur", error);
      }
    }
  }, []);

  const handleToggleMenu = () => setShowMenu((prev) => !prev);

  const handleNavigate = (path: string) => {
    setShowMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <IoMdMenu className="text-2xl text-white cursor-pointer hover:scale-125 transition-all" />
        <img
          src={logo}
          alt="logo"
          width={100}
          style={{
            filter:
              "invert(36%) sepia(100%) saturate(1000%) hue-rotate(190deg) brightness(100%) contrast(97%)",
          }}
        />
      </div>

      <ul className="flex items-center gap-4">
        {menu.map((item, index) => (
          <li key={index} className="hidden md:flex items-center gap-2 font-bold text-white">
            <item.icon />
            <a href="#">{item.name}</a>
          </li>
        ))}

        {user ? (
          <li className="relative">
            <span
              onClick={handleToggleMenu}
              className="text-white font-bold cursor-pointer"
            >
              Bonjour, {user.nom}
            </span>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md py-2 z-50 w-48">
                <button
                  onClick={() => handleNavigate("/reservations")}
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FaCalendarAlt className="mr-2" /> Réservation
                </button>
                <button
                  onClick={() => handleNavigate("/donnees-personnelles")}
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FaAddressCard className="mr-2" /> Données personnelles
                </button>
                <button
                  onClick={() =>
                    handleNavigate(user.type === "client" ? "/client_profile" : "/agence_profile")
                  }
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FaUser className="mr-2" /> Profil
                </button>
                <button
                  onClick={() => handleNavigate("/aide")}
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FaInfoCircle className="mr-2" /> Aide
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" /> Se déconnecter
                </button>
              </div>
            )}
          </li>
        ) : (
          <li className="relative">
            <button
              onClick={() => setShowLoginOptions(!showLoginOptions)}
              className="text-white font-bold"
            >
              Se connecter | S'inscrire
            </button>

            {showLoginOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <ul className="py-2">
                  <li>
                    <Link
                      to="/login_client"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      En tant que client
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login_agence"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      En tant qu’agence
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
