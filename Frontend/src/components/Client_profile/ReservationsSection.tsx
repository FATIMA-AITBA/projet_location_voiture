import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import ActionButton from "./ActionButton";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";

type Reservation = {
  reservee: boolean;
  id: number;
  dateReservation: string;
  vehicule: string;
  agence: string;
  confirmee: boolean;
  dateDepart: string;
  lieuRetrait: string;
  dateRetour: string;
  lieuRetour: string;
  annulee: boolean;
};

const ReservationsSection: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 8000);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/reservations/mes-reservations", {
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

        if (data.reservations) {
          const formatted: Reservation[] = data.reservations.map((res: any) => ({
            id: res.id_reservation,
            dateReservation: res.date_reservation,
            vehicule: res.nom_voiture,
            agence: res.nom_agence,
            confirmee: res.confirmee === 1,
            dateDepart: res.date_depart,
            lieuRetrait: res.lieu_retrait,
            dateRetour: res.date_retour,
            lieuRetour: res.lieu_retour,
            annulee: res.annulee === 1,
            reservee: res.reservee === 1,
          }));
          setReservations(formatted);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
        showNotification("Erreur lors du chargement des réservations", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

 // Fonction pour mettre à jour l'annulation d'une réservation
  const updateAnnulation = async (id: number, newStatus: boolean) => {
    setUpdatingId(id); // active le loader
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/reservations/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ annulee: newStatus }),
      });

      const data = await response.json();

      // Gestion des erreurs liées au token
      if (!response.ok) {
        if (data.message === "Token invalide" || data.message === "Token expiré") {
          showNotification(data.message, "error");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login_client";
        } else {
          // Affichage d'une notification d'erreur du backend
          showNotification(data.message || "Erreur serveur", "error");
        }
        return;
      }

      // Mise à jour de l'état local si la modification est réussie
      if (data.reservations) {
        const formatted: Reservation[] = data.reservations.map((res: any) => ({
          id: res.id_reservation,
          dateReservation: res.date_reservation,
          vehicule: res.nom_voiture,
          agence: res.nom_agence,
          confirmee: res.confirmee === 1,
          dateDepart: res.date_depart,
          lieuRetrait: res.lieu_retrait,
          dateRetour: res.date_retour,
          lieuRetour: res.lieu_retour,
          annulee: res.annulee === 1,
          reservee: res.reservee === 1,
        }));

        setReservations(formatted);
      }

      // Notification de succès
      showNotification(data.message || "Mise à jour réussie", "success");

    } catch (error) {
      // Gestion des erreurs réseau ou inattendues
      console.error("Erreur de mise à jour de l'annulation :", error);
      showNotification("Erreur serveur", "error");
    }finally {
      setUpdatingId(null); // désactive le loader
    }
  };

  // Handler pour annuler une réservation
  const handleCancel = (id: number) => {
    updateAnnulation(id, true);
  };

  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
  navigate("/booking_page", {
    state: {
      reservationId: id
    }
  });
};


  const demandesNonConfirmees = reservations.filter(res => !res.confirmee);
  const demandesConfirmees = reservations.filter(res => res.confirmee);

  const renderTable = (title: string, data: Reservation[]) => (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="overflow-x-auto mb-10">
          <table className="table-auto w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="text-left px-4 py-2">Date réservation</th>
                <th className="text-left px-4 py-2">Véhicule</th>
                <th className="text-left px-4 py-2">Agence</th>
                <th className="text-left px-4 py-2">Statut</th>
                <th className="text-left px-4 py-2">Date départ</th>
                <th className="text-left px-4 py-2">Lieu de départ</th>
                <th className="text-left px-4 py-2">Date retour</th>
                <th className="text-left px-4 py-2">Lieu de retour</th>
                {title === "Demandes confirmées" && (
                  <th className="text-left px-4 py-2">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition">
                  <td className="border-t px-4 py-3">{res.dateReservation}</td>
                  <td className="border-t px-4 py-3">{res.vehicule}</td>
                  <td className="border-t px-4 py-3">{res.agence}</td>
                  <td className={`border-t px-4 py-3 ${res.confirmee ? "text-blue-600" : "text-yellow-600"}`}>
                    {res.confirmee ? "Confirmée" : "En attente"}
                  </td>
                  <td className="border-t px-4 py-3">{res.dateDepart}</td>
                  <td className="border-t px-4 py-3">{res.lieuRetrait}</td>
                  <td className="border-t px-4 py-3">{res.dateRetour}</td>
                  <td className="border-t px-4 py-3">{res.lieuRetour}</td>
                
                    {title === "Demandes confirmées" && (
                      <td className="border-t px-4 py-3">
                         {!res.reservee ? (
                            <div className="flex gap-x-2">
                              <ActionButton
                                loading={updatingId === res.id}
                                onClick={() => handleCancel(res.id)}
                                text="Annuler"
                                loadingText="Annulation..."
                                color="red"
                              />
                              <ActionButton
                                loading={false}
                                onClick={() => handleNavigate(res.id)}
                                text="Réserver"
                                loadingText="Compléter la réservation..."
                                color="blue"
                              />
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium">
                              <FaCheck className="text-green-600" />
                                Réservé
                            </span>
                          )}
                      </td>

                    )}
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mb-10">Aucune réservation dans cette catégorie.</p>
      )}
    </>
  );

  return (
    <section className="my-6 p-6 bg-white shadow-lg rounded-lg">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {loading ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white bg-opacity-70">
          <div className="p-6 bg-white flex items-center justify-center">
            <img src="/images/load.gif" alt="Chargement en cours..." className="w-28 h-28" />
          </div>
        </div>
      ) : (
        <>
          {renderTable("Mes demandes", demandesNonConfirmees)}
          {renderTable("Demandes confirmées", demandesConfirmees)}
        </>
      )}
    </section>
  );
};

export default ReservationsSection;
