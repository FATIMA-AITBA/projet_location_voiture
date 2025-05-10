"use client"; // Mark the file as a client component

import React, { useState } from 'react';
import DriverDetails from '../components/Booking/DriverDetails';
import BookingHeader from '../components/Booking/Bookingheader' ;
import BillingAddress from '../components/Booking/BillingAdress';
import BookingFooter from '../components/Booking/BookingFooter';
import BookingCar from '../components/Booking/BookingCar';
import car1 from "../../public/images/bmwserie1.png"

 // ajouter par abdelilah
import { useLocation} from "react-router-dom";
type LocationState = {
  total: number;
  differenceEnJours: number;
  dateDepart: string;
  dateRetour: string;
  kilometrageType: string;
  car: {
    name: string;
    marque: string;
    places: number;
    typeBoite: string;
    fuelType: string;
    carType: string;
    prixParJour: number;
    kilometrageInclus: number;
    tarifKmSupp: number;
    tarifKmIlimitesParJour: number;
    lieuDeRetrait: string;
    lieuDeRetour: string;
    image: {
      url: string;
    };
  };
}

const BookingForm = () => {
  
  // ajouter par abdelilah
  const location = useLocation();
  const state = location.state as LocationState | null;
  const total = state?.total;
   const car = state?.car;
  const differenceEnJours = state?.differenceEnJours;
  const dateDepart = state?.dateDepart;
  const dateRetour = state?.dateRetour;
  const kilometrageType = state?.kilometrageType;

  

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

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Première section */}
      <BookingHeader total={total} />

      {/* ********************************************************* */}
      

      <div className="flex flex-col lg:flex-row gap-6 h-full">
  {/* Gauche : 2/3 */}
  <div className="flex flex-col gap-6 lg:w-2/3 w-full ml-[32px]">
  <DriverDetails formData={formData} handleInputChange={handleInputChange} />
  <BillingAddress formData={formData} handleInputChange={handleInputChange} />
</div>


  {/* Droite : 1/3 */}
{/* Droite : 1/3 */}
<div className="lg:w-1/3 w-full px-6">
  <div className="sticky top-6">
  <BookingCar
  image={car?.image?.url}
  name={car?.name}
  subtitle={`${car.marque} | ${car.carType}`}
  days={differenceEnJours}
  pickupLocation={car?.lieuDeRetrait}
  pickupDate={dateDepart}
  pickupTime="13:00"
  returnLocation={car?.lieuDeRetour}
  returnDate={dateRetour}
  returnTime="08:30"
  features={[
    "Assurance au tiers",
    "Assistance dépannage 24/7",
    `Kilométrage: ${kilometrageType}`,
    "Option de paiement: Restez flexible - Payez à la prise en charge, annulez et modifiez gratuitement avant l'heure de la prise en charge"
  ]}
/>
  </div>
</div>

</div>




{/* ********************************************************* */}

      {/* Section footer */}
      <BookingFooter total={total} />
    </div>
  );
};

export default BookingForm;

