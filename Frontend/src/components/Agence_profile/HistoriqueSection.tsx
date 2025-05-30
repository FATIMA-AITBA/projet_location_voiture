import React, { useEffect, useState } from "react";

interface ReservationHistory {
  vehicule: string;
  client: string;
  dateReservation: string;
  dateDepart: string;
  dateRetour: string;
}

const HistoriqueAgence: React.FC = () => {
  const [historiques, setHistoriques] = useState<ReservationHistory[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Non authentifié");

        // Vous pouvez extraire l'ID agence de votre user stocké en local
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const agenceId = user.id;

        const res = await fetch(
          `http://localhost:5000/api/reservations-historique/agence/${agenceId}/historiques`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Erreur API");
        }
        const json = await res.json();
        setHistoriques(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <section className="my-6 p-6 bg-white shadow rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Historique – Agence</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">Véhicule</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Date Réservation</th>
              <th className="px-4 py-2 text-left">Date Départ</th>
              <th className="px-4 py-2 text-left">Date Retour</th>
            </tr>
          </thead>
          <tbody>
            {historiques.map((h, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="border-t px-4 py-3">{h.vehicule}</td>
                <td className="border-t px-4 py-3">{h.client}</td>
                <td className="border-t px-4 py-3">{h.dateReservation}</td>
                <td className="border-t px-4 py-3">{h.dateDepart}</td>
                <td className="border-t px-4 py-3">{h.dateRetour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default HistoriqueAgence;
