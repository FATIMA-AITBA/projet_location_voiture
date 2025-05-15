import React, { useEffect, useState } from "react";

interface Reservation {
  id_reservation: number;
  nom_voiture: string;
  nom_client: string;
  date_depart: string;
  date_retour: string;
  date_demande: string;
}

const ReservationsSection: React.FC = () => {
  const [reservationsEnAttente, setReservationsEnAttente] = useState<Reservation[]>([]);
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

      const resEnAttente = await fetch(
        `http://localhost:5000/api/reservations/agence/${agenceId}/en-attente`,
        { headers }
      );

      if (!resEnAttente.ok) {
        const body = await resEnAttente.json().catch(() => null);
        throw new Error(body?.message || `Erreur ${resEnAttente.status}`);
      }

      const dataEnAttente = (await resEnAttente.json()) as Reservation[];
      setReservationsEnAttente(dataEnAttente);
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

      const response = await fetch(`http://localhost:5000/api/reservations/${id_reservation}/confirmer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `Erreur ${response.status}`);
      }

      // Mise à jour locale des données
      setReservationsEnAttente((prev) =>
        prev.filter((reservation) => reservation.id_reservation !== id_reservation)
      );
    } catch (error: any) {
      alert("Erreur lors de la confirmation : " + error.message);
    }
  };

  const renderTable = (reservations: Reservation[]) => (
    <div className="overflow-x-auto mb-8">
      <table className="table-auto w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="text-left px-4 py-2">Véhicule</th>
            <th className="text-left px-4 py-2">Client</th>
            <th className="text-left px-4 py-2">Date départ</th>
            <th className="text-left px-4 py-2">Date retour</th>
            <th className="text-left px-4 py-2">Date demande</th>
            <th className="text-left px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((r) => (
              <tr key={r.id_reservation} className="hover:bg-gray-50 transition">
                <td className="border-t px-4 py-3">{r.nom_voiture}</td>
                <td className="border-t px-4 py-3">{r.nom_client}</td>
                <td className="border-t px-4 py-3">{r.date_depart.slice(0, 10)}</td>
                <td className="border-t px-4 py-3">{r.date_retour.slice(0, 10)}</td>
                <td className="border-t px-4 py-3">{r.date_demande?.slice(0, 10) || "—"}</td>
                <td className="border-t px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleConfirmer(r.id_reservation)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Confirmer
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Rejeter
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Aucune réservation en attente.
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
      <h4 className="text-lg font-semibold text-gray-700 mb-2">En attente</h4>
      {renderTable(reservationsEnAttente)}
    </section>
  );
};

export default ReservationsSection;
