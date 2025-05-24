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

const API_BASE = "http://localhost:5000/api/reservations";

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

      const [resEnAttente, resConfirmees] = await Promise.all([
        fetch(`${API_BASE}/agence/${agenceId}/en-attente`, { headers }),
        fetch(`${API_BASE}/agence/${agenceId}/confirmees`, { headers }),
      ]);

      if (!resEnAttente.ok || !resConfirmees.ok) {
        const msg = await resEnAttente.text();
        throw new Error(msg || "Erreur lors de la récupération des réservations");
      }

      const dataEnAttente = await resEnAttente.json();
      const dataConfirmees = await resConfirmees.json();

      setReservationsEnAttente(dataEnAttente);
      console.log("Réservations confirmées reçues :", dataConfirmees);

      const normalized: Reservation[] = dataConfirmees.map((r: any) => ({
        ...r,
        annulee: Number(r.annulee),
        reservee: Number(r.reservee),
      }));
      setReservationsConfirmees(normalized);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmer = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant");
      const res = await fetch(`${API_BASE}/${id}/confirmer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || `Erreur ${res.status}`);
      await fetchReservations();
    } catch (e: any) {
      alert("Erreur confirmation : " + e.message);
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de l'opération");
    }

    // Rafraîchir les données
    await fetchReservations();
    alert(await response.json().then(data => data.message));

  } catch (error: any) {
    alert("Erreur : " + error.message);
  }
};

  const renderTable = (reservations: Reservation[], type: 'attente' | 'confirmees') => (
    <div className="overflow-x-auto mb-8">
      <table className="table-auto w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">Véhicule</th>
            <th className="px-4 py-2 text-left">Client</th>
            <th className="px-4 py-2 text-left">Date départ</th>
            <th className="px-4 py-2 text-left">Date retour</th>
            <th className="px-4 py-2 text-left">Date demande</th>
            {type === 'confirmees' && <th className="px-4 py-2 text-left">Statut</th>}
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? reservations.map(r => {
            const statut = r.annulee === 1
              ? { label: 'Annulé', color: 'bg-red-200 text-red-800' }
              : r.reservee === 1
              ? { label: 'Réservé', color: 'bg-green-200 text-green-800' }
              : { label: 'En attente', color: 'bg-yellow-200 text-yellow-800' };

            return (
              <tr key={r.id_reservation} className="hover:bg-gray-50 transition">
                <td className="border-t px-4 py-3">{r.nom_voiture}</td>
                <td className="border-t px-4 py-3">{r.nom_client}</td>
                <td className="border-t px-4 py-3">{r.date_depart.slice(0,10)}</td>
                <td className="border-t px-4 py-3">{r.date_retour.slice(0,10)}</td>
                <td className="border-t px-4 py-3">{r.date_demande?.slice(0,10) || '—'}</td>

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
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white rounded"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white rounded"
                      >
                        Rejeter
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRetournee(r.id_reservation, r.annulee === 1)}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-white rounded"
                    >
                      Retournée
                    </button>
                  )}
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={type==='confirmees'?7:6} className="text-center py-4">
                Aucune réservation {type==='attente'?'en attente':'confirmée'}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error)   return <div className="p-4 text-red-600">Erreur : {error}</div>;

  return (
    <section className="my-6 p-6 bg-white shadow-lg rounded-lg">
      <h3 className="mb-6 text-2xl font-semibold text-gray-800">Demandes de Réservation</h3>
      <div className="space-y-8">
        <div>
          <h4 className="mb-2 text-lg font-semibold text-gray-700">En attente</h4>
          {renderTable(reservationsEnAttente, 'attente')}
        </div>
        <div>
          <h4 className="mb-2 text-lg font-semibold text-gray-700">Confirmées</h4>
          {renderTable(reservationsConfirmees, 'confirmees')}
        </div>
      </div>
    </section>
  );
};

export default ReservationsSection;
