"use client";

import { useEffect, useState } from "react";
import Navbar from '../components/Agence_profile/Navbar';
import ProfileSection from '../components/Agence_profile/ProfileSection';
import AnnoncesSection from '../components/Agence_profile/AnnoncesSection';
import ReservationsSection from '../components/Agence_profile/ReservationsSection';
import StatistiquesSection from '../components/Agence_profile/StatistiquesSection';
import HistoriqueReservations from "../components/Agence_profile/HistoriqueSection";

export default function AgenceProfile() {
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [agencyData, setAgencyData] = useState<any>(null); // agencyData est initialisé à null

  useEffect(() => {
    // Récupère les données du localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.type === 'agence') {
        setAgencyData({
          name: parsed.nom, // Nom de l'agence
          email: parsed.email || 'contact@xyz.com', // Email de l'agence
          contact: parsed.contact || '+33 123 456 789', // Contact (anciennement téléphone)
          adresse: parsed.adresse || '123 Rue de Paris, Paris, France', // Adresse
          description: parsed.description || 'Location de voitures premium avec service personnalisé.' // Description par défaut
        });
      }
    }
  }, []);
  

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  if (!agencyData) {
    return <div>Chargement...</div>; // Affiche "Chargement..." tant que les données ne sont pas disponibles
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        agencyName={agencyData.name} 
        handleSectionClick={handleSectionClick} 
      />

      <div className="pt-32 px-6">
        {activeSection === "profile" && <ProfileSection agency={agencyData} />}
        {activeSection === "annonces" && <AnnoncesSection />}
        {activeSection === "reservations" && <ReservationsSection />}
        {activeSection === "historiquereservations" && <HistoriqueReservations />}
        {activeSection === "statistiques" && <StatistiquesSection />}
      </div>
    </div>
  );
}