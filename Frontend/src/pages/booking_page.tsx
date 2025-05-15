"use client";

import React, { useState, useEffect } from 'react';
import DriverDetails from '../components/Booking/DriverDetails';
import BookingHeader from '../components/Booking/Bookingheader';
import BillingAddress from '../components/Booking/BillingAdress';
import BookingFooter from '../components/Booking/BookingFooter';
import BookingCar from '../components/Booking/BookingCar';

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
  const state = location.state as LocationState | null;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) return;

      // 🔐 Token récupéré dynamiquement (à adapter selon ton système d’authentification)
      const token = localStorage.getItem('token'); // ou via Clerk/Auth context

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
  }, [reservationId]);

  return (
    <div className="min-h-screen bg-white p-4">
      <BookingHeader />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex flex-col gap-6 lg:w-2/3 w-full ml-[32px]">
          <DriverDetails formData={formData} handleInputChange={handleInputChange} />
          <BillingAddress formData={formData} handleInputChange={handleInputChange} />
        </div>

        <div className="lg:w-1/3 w-full px-6">
          <div className="sticky top-6">
            {reservationData && (
              <BookingCar
                image={`/images/${reservationData.image}`} // À adapter selon ta structure d’assets
                name={reservationData.name}
                subtitle={`${reservationData.marque} | ${reservationData.carType}`}
                days={calculateDaysDifference(reservationData.date_depart, reservationData.date_retour)}
                pickupLocation={reservationData.lieu_retrait}
                pickupDate={reservationData.date_depart}
                pickupTime="13:00"
                returnLocation={reservationData.lieu_retour}
                returnDate={reservationData.date_retour}
                returnTime="08:30"
                features={[
                  "Assurance au tiers",
                  "Assistance dépannage 24/7",
                  "Kilométrage: Illimité",
                  "Option de paiement: Restez flexible - Payez à la prise en charge, annulez et modifiez gratuitement avant l'heure de la prise en charge"
                ]}
              />
            )}
          </div>
        </div>
      </div>

      <BookingFooter />
    </div>
  );
};

export default BookingForm;
