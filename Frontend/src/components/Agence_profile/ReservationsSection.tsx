import React, { useEffect, useState } from "react";

interface Reservation {
  id_reservation: number;
  nom_voiture: string;
  nom_client: string;
  date_depart: string;
  date_retour: string;
  date_demande: string;
  annulee: number;
  reservee: number;
}

const ReservationsSection: React.FC = () => {
  const [reservationsEnAttente, setReservationsEnAttente] = useState<Reservation[]>([]);
  const [reservationsConfirmees, setReservationsConfirmees] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!token || !userString) throw new Error("Vous devez être connecté en tant qu'agence");

      const user = JSON.parse(userString) as { id: number; type: string };
      if (user.type !== "agence") throw new Error("Le profil connecté n'est pas une agence");

      const agenceId = user.id;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Récupération des réservations en attente et confirmées
      const [resEnAttente, resConfirmees] = await Promise.all([
        fetch(`http://localhost:5000/api/reservations/agence/${agenceId}/en-attente`, { headers }),
        fetch(`http://localhost:5000/api/reservations/agence/${agenceId}/confirmees`, { headers })
      ]);

      if (!resEnAttente.ok || !resConfirmees.ok) {
        const errorText = await resEnAttente.text();
        throw new Error(errorText || "Erreur lors de la récupération des réservations");
      }

      const dataEnAttente  = await resEnAttente.json();
      const dataConfirmees = await resConfirmees.json();

      setReservationsEnAttente(dataEnAttente);

      // Debug : afficher dans la console ce que renvoie le back
      console.log("Réservations confirmées reçues :", dataConfirmees);

      // Normaliser les types TinyInt(1) → number
      const normalizedConfirmees: Reservation[] = dataConfirmees.map((r: any) => ({
        ...r,
        annulee:  Number(r.annulee),
        reservee: Number(r.reservee),
      }));

      setReservationsConfirmees(normalizedConfirmees);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmer = async (id_reservation: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const response = await fetch(
        `http://localhost:5000/api/reservations/${id_reservation}/confirmer`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
        }
      );

      if (!response.ok) throw new Error("Échec de la confirmation");
      await fetchReservations();
    } catch (error: any) {
      alert("Erreur lors de la confirmation : " + error.message);
    }
  };

  const handleRetournee = async (id_reservation: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id_reservation}/retournee`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");
      await fetchReservations();
    } catch (error: any) {
      alert("Erreur : " + error.message);
    }
  };

  const renderTable = (reservations: Reservation[], type: 'attente' | 'confirmees') => (
    <div className="overflow-x-auto mb-8">
      <table className="table-auto w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="text-left px-4 py-2">Véhicule</th>
            <th className="text-left px-4 py-2">Client</th>
            <th className="text-left px-4 py-2">Date départ</th>
            <th className="text-left px-4 py-2">Date retour</th>
            <th className="text-left px-4 py-2">Date demande</th>
            {type === 'confirmees' && <th className="text-left px-4 py-2">Statut</th>}
            <th className="text-left px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((r) => {
              const statut =
                r.annulee === 1
                  ? { label: 'Annulé',   color: 'bg-red-200 text-red-800' }
                  : r.reservee === 1
                  ? { label: 'Réservé',  color: 'bg-green-200 text-green-800' }
                  : { label: 'En attente', color: 'bg-yellow-200 text-yellow-800' };

              return (
                <tr key={r.id_reservation} className="hover:bg-gray-50 transition">
                  <td className="border-t px-4 py-3">{r.nom_voiture}</td>
                  <td className="border-t px-4 py-3">{r.nom_client}</td>
                  <td className="border-t px-4 py-3">{r.date_depart.slice(0, 10)}</td>
                  <td className="border-t px-4 py-3">{r.date_retour.slice(0, 10)}</td>
                  <td className="border-t px-4 py-3">{r.date_demande?.slice(0, 10) || "—"}</td>
                  
                  {type === 'confirmees' && (
                    <td className="border-t px-4 py-3">
                      <span className={`${statut.color} px-2 py-1 rounded-full text-xs font-medium`}>
                        {statut.label}
                      </span>
                    </td>
                  )}

                  <td className="border-t px-4 py-3 space-x-2">
                    {type === 'attente' ? (
                      <>
                        <button
                          onClick={() => handleConfirmer(r.id_reservation)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => {/* TODO: gérer le rejet */}}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Rejeter
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRetournee(r.id_reservation)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Retournée
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={type === 'confirmees' ? 7 : 6} className="text-center py-4">
                Aucune réservation {type === 'attente' ? 'en attente' : 'confirmée'}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="p-4">Chargement des réservations…</div>;
  if (error) return <div className="p-4 text-red-600">Erreur : {error}</div>;

  return (
    <section className="my-6 p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Mes Réservations</h3>
      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">En attente</h4>
          {renderTable(reservationsEnAttente, 'attente')}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Confirmées</h4>
          {renderTable(reservationsConfirmees, 'confirmees')}
        </div>
      </div>
    </section>
  );
};

export default ReservationsSection;
