import React, { useState } from "react";
import {FaUser, FaCalendarCheck, FaHistory ,  FaArrowLeft } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { MdClose } from "react-icons/md";  // Importer MdClose
import Deconnexion from "./Deconnexion";
import { Link } from "react-router-dom";


interface NavbarProps {
  clientName: string;
  handleSectionClick: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ clientName, handleSectionClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Profil", value: "profile" },
    { label: "Réservations", value: "reservations" },
    { label: "Historique des Réservations", value: "reservationHistory" },
  ];

  const handleLinkClick = (value: string) => {
    handleSectionClick(value);
    setMenuOpen(false); // Ferme le menu mobile après clic
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 18 ? "Bonjour" : "Bonsoir";
  };
  
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);


  return (
    <nav className="w-full bg-white text-black flex justify-between items-center px-8 py-6 shadow-lg fixed top-4 left-0 z-50">
      <div className="flex items-center gap-10">

         {/* Bouton vers l'accueil */}
        <Link
          to="/"
          className="text-black hover:text-blue-700 text-2xl md:text-xl"
          aria-label="Accueil"
        >
          <FaArrowLeft />
        </Link>


        {/* Menu icon (mobile) */}
        <button
          className="md:hidden text-3xl text-blue-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <MdClose /> // Affiche MdClose si le menu est ouvert
          ) : (
            <IoMdMenu /> // Affiche IoMdMenu si le menu est fermé
          )}
        </button>

        {/* Navigation links (desktop) */}
        <div className="hidden md:flex gap-8 text-lg font-bold tracking-wide">
          {links.map((link) => (
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

      <div className="relative">
          {/* Client name */}
          <div className="flex items-center gap-2 text-lg font-semibold ">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white text-xl cursor-pointer"
              onClick={toggleMenu}
            >
              {clientName?.charAt(0).toUpperCase()}
            </div>
            <span>{getGreeting()}, {clientName}</span>
          </div>

          {/* Menu Déconnexion */}
          {showMenu && (
            <div className="absolute mt-1 right-0.5  z-50">
              <Deconnexion  />
            </div>
          )}
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-blue-500 border shadow-lg md:hidden z-50 flex flex-col text-lg font-medium">
          {links.map((link, index) => (
            <React.Fragment key={link.value}>
              <button
                onClick={() => handleLinkClick(link.value)}
                className="text-left text-white hover:text-blue-500 hover:bg-white transition-colors p-4 pl-9 w-full"
              >
                <span className="flex items-center gap-2">
                  {link.value === "profile" && <FaUser />}
                  {link.value === "reservations" && <FaCalendarCheck />}
                  {link.value === "reservationHistory" && <FaHistory />}
                  {link.label}
                </span>
              </button>
              {index !== links.length - 1 && <hr className="border-blue-300" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
