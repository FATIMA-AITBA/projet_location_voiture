import { FaCarAlt, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

interface NavbarProps {
  agencyName: string;
  handleSectionClick: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ agencyName, handleSectionClick }) => {
  return (
    <nav className="w-full bg-white text-black flex justify-between items-center px-8 py-6 shadow-lg fixed top-4 left-0 z-50">
      
      <div className="flex items-center gap-10">
        {/* Flèche vers la page d'accueil */}
        <Link to="/" className="text-black-500 hover:text-blue-700 text-xl">
          <FaArrowLeft />
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex gap-8 text-lg font-bold tracking-wide">
          {[
            { label: "Profil", value: "profile" },
            { label: "Annonces", value: "annonces" },
            { label: "Réservations", value: "reservations" },
            { label: "Historique Réservations", value: "historiquereservations" },
            { label: "Statistiques", value: "statistiques" },
          ].map((link) => (
            <a
              key={link.value}
              href="#"
              onClick={() => handleSectionClick(link.value)}
              className="relative hover:text-blue-500 transition-colors duration-200 before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-blue-500 hover:before:w-full before:transition-all before:duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Nom de l'agence */}
      <div className="flex items-center gap-2 text-lg font-semibold">
        <FaCarAlt className="text-2xl text-blue-500" />
        <span>{agencyName}</span>
      </div>
    </nav>
  );
};

export default Navbar;
