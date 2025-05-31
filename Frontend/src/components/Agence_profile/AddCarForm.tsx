import React, { useState, useRef } from "react";

const AddCarForm: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('http://localhost:5000/api/voitures', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ne PAS mettre 'Content-Type' ici
        },
        body: formData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(err.message || 'Erreur lors de la création');
      }

      window.alert('Annonce publiée avec succès');
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error: any) {
      console.error(error);
      window.alert(`Erreur : ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const marques = [ 
  'Audi','Mercedes','Dacia','Peugeot','Renault','Toyota','VW','BMW','Fiat',
  'Ford','Jeep','Honda','Nissan','Mazda','Hyundai','Kia','Volvo','Cadillac',
  'Mitsubishi','Jaguar'
 ];

  const villes = ['Marrakech','Kenitra','Rabat','Tanger','Casablanca','Agadir','Oujda'];

  return (
    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} ref={formRef} encType="multipart/form-data">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une nouvelle voiture</h3>
        <p className="text-gray-600 mb-6">Veuillez remplir tous les champs obligatoires</p>

      {/* Informations de base */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Informations de base</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nom du véhicule <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ex: Renault Clio 4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image du véhicule <span className="text-red-500">*</span>
            </label>
           <input
  type="file"
  name="image"
  accept="image/*"
  className="w-full h-[42px] border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:h-full"
/>

          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Type de véhicule <span className="text-red-500">*</span>
            </label>
            <select
              name="carType"
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submitting}
            >
              <option value="">Sélectionner un type</option>
              {['Berline', 'SUV', 'Coupe', 'Cabriolet', 'Minivan', 'Break', 'Citadine', 'Véhicule de luxe', 'Utilitaire', 'Familiale'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Marque <span className="text-red-500">*</span>
            </label>
            <select
              name="marque"
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={submitting}
            >
              <option value="">Sélectionner une marque</option>
              {marques.map(mq => (
                <option key={mq} value={mq}>{mq}</option>
              ))}
            </select>
          </div>
        </div>
      </div>


        {/* Caractéristiques techniques */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Caractéristiques techniques</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[ 
              { name: 'places', label: 'Nombre de places', defaultValue: '4' },
              { name: 'nombre_portes', label: 'Nombre de portes', defaultValue: '4' },
              { name: 'nombre_bagages', label: 'Capacité bagages', defaultValue: '2' }
            ].map(field => (
              <div key={field.name}>
                <label className="block text-gray-700 font-medium mb-2">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name={field.name}
                  defaultValue={field.defaultValue}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitting}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Type de boîte <span className="text-red-500">*</span></label>
              <select name="typeBoite" defaultValue="Automatique" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={submitting}>
                <option>Automatique</option>
                <option>Manuelle</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Type de carburant <span className="text-red-500">*</span></label>
              <select name="fuelType" defaultValue="Essence" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={submitting}>
                <option>Essence</option>
                <option>Diesel</option>
                <option>Electrique</option>
                <option>Hybride</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lieu et disponibilité */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Lieu et disponibilité</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['lieu_retrait','lieu_retour'].map(fieldName => (
              <div key={fieldName}>
                <label className="block text-gray-700 font-medium mb-2">
                  {fieldName === 'lieu_retrait' ? 'Lieu de retrait' : 'Lieu de retour'} <span className="text-red-500">*</span>
                </label>
                <select name={fieldName} defaultValue="" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={submitting}>
                  <option value="">Sélectionner une ville</option>
                  {villes.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Tarification */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Tarification</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Prix par jour (DH) <span className="text-red-500">*</span></label>
              <input type="number" name="prix_par_jour" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={submitting} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Kilométrage inclus <span className="text-red-500">*</span></label>
              <input type="number" name="kilometrage_inclus" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={submitting} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tarif km supplémentaire</label>
              <input type="number" name="tarif_km_sup" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={submitting} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tarif km illimités/jour</label>
              <input type="number" name="tarif_km_illimites_par_jour" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={submitting} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all">
            {submitting ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarForm;
