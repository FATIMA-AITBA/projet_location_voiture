import React, { useState, useEffect } from "react";
import AddCarForm from "./AddCarForm";

interface Car {
  id: number;
  name: string;
  marque: string;
  disponible: number;
}

interface Reservation {
  id: number;
  carList: {
    id: number;
  };
  // autres champs non utilisés ici
}

interface ApiResponse {
  carLists: Car[];
  reservations: Reservation[];
}

const AnnoncesSection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleForm = () => setShowForm(prev => !prev);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/voitures/AllVoituresEtReservations", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération des annonces");
        const data: ApiResponse = await res.json();
        setCars(data.carLists);
        setReservations(data.reservations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="my-6 p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Mes Annonces</h3>

      <table className="table-auto w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="text-left px-4 py-2">Véhicule</th>
            <th className="text-left px-4 py-2">Statut</th>
            <th className="text-left px-4 py-2">Réservations en Attente</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => {
            const count = reservations.filter(r => r.carList.id === car.id).length;
            const statut = car.disponible === 1 ? "Active" : "Inactive";
            const statutColor = car.disponible === 1 ? "text-green-600" : "text-gray-500";
            return (
              <tr key={car.id} className="hover:bg-gray-50 transition">
                <td className="border-t px-4 py-3">{`${car.name} - ${car.marque}`}</td>
                <td className={`border-t px-4 py-3 font-medium ${statutColor}`}>{statut}</td>
                <td className="border-t px-4 py-3">
                  {car.disponible === 1 ? count : '-'}
                </td>
                <td className="border-t px-4 py-3 space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
                    Modifier
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all">
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end mt-6">
        <button onClick={toggleForm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all">
          {showForm ? "Annuler" : "Publier une annonce"}
        </button>
      </div>
      {showForm && <AddCarForm />}
    </section>
  );
};

export default AnnoncesSection;
