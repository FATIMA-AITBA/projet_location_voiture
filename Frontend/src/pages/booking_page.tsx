'use client';

import React, { useState, useEffect } from 'react';
import DriverDetails from '../components/Booking/DriverDetails';
import BookingHeader from '../components/Booking/Bookingheader';
import BillingAddress from '../components/Booking/BillingAdress';
import BookingFooter from '../components/Booking/BookingFooter';
import BookingCar from '../components/Booking/BookingCar';
import StatusPopup from '../components/Booking/StatusPopup';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

type LocationState = {
  reservationId: number;
};

type ReservationAPIResponse = {
  message: string;
  reservations: {
    id_reservation: number;
    id_voiture: number;
    image: string;
    name: string;
    marque: string;
    carType: string;
    lieu_retrait: string;
    date_depart: string;
    lieu_retour: string;
    date_retour: string;
    prix_journalier: string;
    montantHT: string;
    TVA: string;
    supp_local: string;
    total_frais: string;
    montantTTC: string;
    kilometrageType: string;

  };
};

const calculateDaysDifference = (dateDepart: string, dateRetour: string): number => {
  const departDate = new Date(dateDepart + "T00:00:00Z");
  const retourDate = new Date(dateRetour + "T00:00:00Z");

  if (isNaN(departDate.getTime()) || isNaN(retourDate.getTime())) {
    console.error("Erreur de conversion de date.");
    return NaN;
  }

  const timeDifference = retourDate.getTime() - departDate.getTime();
  return timeDifference / (1000 * 3600 * 24);
};

const BookingForm = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const reservationId = state?.reservationId;

  const [reservationData, setReservationData] = useState<ReservationAPIResponse["reservations"] | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '+212',
    country: '',
    street: '',
    postalCode: '',
    city: '',
  });

  const [clientData, setClientData] = useState<{
    id: number | null;
    name: string;
    email: string;
    contact: string;
    permis: string;
    age: number | null;
  }>({
    id: null,
    name: "",
    email: "",
    contact: "",
    permis: "",
    age: null,
  });

  const [popupState, setPopupState] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!reservationId || !clientData.id) return;

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      // Création de la facture
      await axios.post('http://localhost:5000/api/factures/createFacture', {
        id_client: clientData.id,
        entreprise: formData.company,
        nom_chauffeur: formData.firstName,
        prenom_chauffeur: formData.lastName,
        email_chauffeur: formData.email,
        telephone_chauffeur: formData.phoneNumber,
        pays: formData.country,
        rue: formData.street,
        code_postal: formData.postalCode,
        ville: formData.city,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Confirmation de la réservation
      await axios.get(`http://localhost:5000/api/reservations/client/${reservationId}/confirmer`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setPopupState({
        type: 'success',
        message: "Votre réservation a été effectuée avec succès !",
      });
    } catch (error) {
      console.error('Erreur lors du processus de réservation :', error);
      setPopupState({
        type: 'error',
        message: "Une erreur s'est produite lors de la réservation. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) return;

      const token = localStorage.getItem('token');

      try {
        const response = await axios.get<ReservationAPIResponse>(
          `http://localhost:5000/api/reservations/${reservationId}/reservation`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservationData(response.data.reservations);
      } catch (error) {
        console.error("Erreur lors de la récupération de la réservation :", error);
      }
    };

    fetchReservation();

    // Récupération des données client depuis localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.type === "client") {
        setClientData({
          id: parsed.id,
          name: parsed.nom || "Nom inconnu",
          email: parsed.email || "contact@exemple.com",
          contact: parsed.contact || "+33 000 000 000",
          permis: parsed.permis || "Permis inconnu",
          age: parsed.age || 0,
        });
      }
    }
  }, [reservationId]);

  const daysDifference = reservationData
    ? calculateDaysDifference(reservationData.date_depart, reservationData.date_retour)
    : null;

  return (
    <div className="min-h-screen bg-white p-4 relative">
      <BookingHeader total={reservationData?.montantTTC} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex flex-col gap-6 lg:w-2/3 w-full ml-[32px]">
          <DriverDetails formData={formData} handleInputChange={handleInputChange} />
          <BillingAddress formData={formData} handleInputChange={handleInputChange} />
        </div>

        <div className="lg:w-1/3 w-full px-6">
          <div className="sticky top-6">
            {reservationData && (
              <BookingCar
                image={`http://localhost:5000/uploads/${reservationData.image}`}
                name={reservationData.name}
                subtitle={`${reservationData.marque} | ${reservationData.carType}`}
                days={daysDifference || 0}
                pickupLocation={reservationData.lieu_retrait}
                pickupDate={reservationData.date_depart}
                pickupTime="13:00"
                returnLocation={reservationData.lieu_retour}
                returnDate={reservationData.date_retour}
                returnTime="08:30"
                features={[
                  "Assurance au tiers",
                  "Assistance dépannage 24/7",
                  `Kilométrage: ${reservationData.kilometrageType}`,
                  "Option de paiement: Restez flexible - Payez à la prise en charge, annulez et modifiez gratuitement avant l'heure de la prise en charge"
                ]}
              />
            )}
          </div>
        </div>
      </div>

      <BookingFooter onSubmit={handleSubmit} disabled={loading}   total={reservationData?.montantTTC} />

      {popupState && (
        <StatusPopup
          type={popupState.type}
          message={popupState.message}
          onClose={() => setPopupState(null)}
          formData={formData}
          reservationData={reservationData}
          daysDifference={daysDifference}
          TypeAssurance="Assurance au tiers"
          clientdata={clientData}
        />
      )}
    </div>
  );
};

export default BookingForm;
