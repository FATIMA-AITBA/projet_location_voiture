'use client'

import '../index.css'
import SloganSection from '../components/Home/SloganSection'
import HeaderSection from '../components/Home/HeaderSection'
import DevisesSection from '../components/Home/DevisesSection'
import { getCarList } from '../../Services'
import { useEffect, useState } from 'react'
import CarCarousel from '../components/Home/CarCarousel'
import TroisEtapes from '../components/Home/TroisEtapes'
import Footer from '../components/Utils/Footer'
import StatsSection from "../components/Home/StatsSection"
import TemoignagesClients from '../components/Home/TemoignagesClients'


interface Car {
  id: string;
  model: string;
  brand: string;
  price: number;
 
}

interface Reservation {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
}

export default function Home() {
  const [carList, setCarList] = useState<Car[]>([]) 
  const [carFilter, setCarFilter] = useState<Car[]>([]) 
  const [reservationList, setReservationList] = useState<Reservation[]>([]) 

  useEffect(() => {
    getCars()
  }, [])

  const getCars = async () => {
    const result: any = await getCarList() 
    console.log(result.carLists)
    setCarList(result.carLists)
    setCarFilter(result.carLists)
    setReservationList(result.reservations)
  }

  return (
    <main>
      <SloganSection />
      <HeaderSection carFilter={carFilter} carList={carList} setCarList={setCarList} reservationList={reservationList} />
      <DevisesSection />
      <CarCarousel carList={carList} />
      <TroisEtapes />
      <TemoignagesClients /> 
      <StatsSection />
      <Footer />
    </main>
  )
}
