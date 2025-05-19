// Importations nécessaires
import React, { useEffect, useState } from "react";
import Notification from "./Notification";


type Reservation = {
  id: number;
  dateReservation: string;
  vehicule: string;
  agence: string;
  dateDepart: string;
  lieuRetrait: string;
  dateRetour: string;
  lieuRetour: string;
};

const ReservationsHistoriqueSection: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
 


  // Fonction pour afficher une notification temporairement
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 8000);
  };

  // Récupération des réservations au chargement initial
  useEffect(() => {
    const fetchReservationsHistorique = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/reservations-historique/mes-historiques", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.message === "Token invalide" || data.message === "Token expiré") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login_client";
          } else {
            showNotification(data.message || "Erreur serveur", "error");
          }
          return;
        }

        // Formatage des données de l'historique
        if (data.reservationshistoriques) {
          const formatted: Reservation[] = data.reservationshistoriques.map((res: any) => ({
            id: res.id_historique,
            dateReservation: res.date_reservation,
            vehicule: res.nom_voiture,
            agence: res.nom_agence,
            dateDepart: res.date_depart,
            lieuRetrait: res.lieu_retrait,
            dateRetour: res.date_retour,
            lieuRetour: res.lieu_retour,
          }));

          setReservations(formatted);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des historiques :", error);
        showNotification("Erreur lors du chargement des historiques", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsHistorique();
  }, []);

 

  return (
    <section className="my-6 p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Mes Réservations Historique</h3>

      {/* Affichage de la notification */}
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      {/* Affichage d'un loader pendant le chargement des historiques */}
      {loading ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white bg-opacity-70">
          <div className="p-6 bg-white flex items-center justify-center">
            <img src="/images/load.gif" alt="Chargement en cours...." className="w-28 h-28" />
          </div>
        </div>
      ) : (
        // Affichage du tableau des réservations historiques
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="text-left px-4 py-2">Date réservation</th>
                <th className="text-left px-4 py-2">Véhicule</th>
                <th className="text-left px-4 py-2">Agence</th>
                <th className="text-left px-4 py-2">Date départ</th>
                <th className="text-left px-4 py-2">Lieu de départ</th>
                <th className="text-left px-4 py-2">Date retour</th>
                <th className="text-left px-4 py-2">Lieu de retour</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition">
                  <td className="border-t px-4 py-3">{res.dateReservation}</td>
                  <td className="border-t px-4 py-3">{res.vehicule}</td>
                  <td className="border-t px-4 py-3">{res.agence}</td>
                  <td className="border-t px-4 py-3">{res.dateDepart}</td>
                  <td className="border-t px-4 py-3">{res.lieuRetrait}</td>
                  <td className="border-t px-4 py-3">{res.dateRetour}</td>
                  <td className="border-t px-4 py-3">{res.lieuRetour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ReservationsHistoriqueSection;
