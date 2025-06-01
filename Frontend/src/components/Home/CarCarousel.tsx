"use client";

import { useEffect, useRef, useState } from 'react';
import Card from '../Utils/Card';
import CarDetails from '../Utils/CarDetails';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// Définition des types pour les props
interface Car {
  name: string;
  typeBoite: string;
  places: number;
  fuelType: string;
  marque: string;
  image: { url: string };
  kilometrageInclus: number;
  prixParJour: number;
}

interface CarCarouselProps {
  carList: Car[];
  differenceEnJours: number;
}

export default function CarCarousel({ carList, differenceEnJours }: CarCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [arrowOffset, setArrowOffset] = useState<number>(60); // distance des flèches
  const [isClient, setIsClient] = useState<boolean>(false);
  const sliderRef = useRef<Slider | null>(null); // Typage de la référence

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const updateSize = () => {
        const width = window.innerWidth;
        setWindowWidth(width);

        // Ajuster la distance des flèches selon la largeur
        if (width >= 1024) {
          setArrowOffset(60); // Desktop
        } else if (width >= 768) {
          setArrowOffset(20); // Tablet
        } else {
          setArrowOffset(10); // Mobile
        }
      };

      updateSize(); // mise à jour initiale
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const getColsPerRow = () => {
    if (windowWidth >= 1280) return 3;
    if (windowWidth >= 768) return 2;
    return 1;
  };

  const colsPerRow = getColsPerRow();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: colsPerRow,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="relative max-w-[1200px] mx-auto p-4">
      <div className="flex flex-col gap-6">
        {isClient && (
          <Slider {...settings} ref={sliderRef}>
            {carList.map((car, index) => (
              <div key={index} className="px-2">
                <Card car={car} onSelect={() => handleSelect(index)} />
              </div>
            ))}
          </Slider>
        )}

        {selectedIndex !== null && (
          <div className="w-full animate-fade-in mt-6">
            <CarDetails
              car={carList[selectedIndex]}
              onBack={() => setSelectedIndex(null)}
              differenceEnJours={differenceEnJours}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .slick-prev,
        .slick-next {
          z-index: 20;
          width: 60px;
          height: 60px;
          background-color: white;
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slick-prev:before,
        .slick-next:before {
          color:  #2563eb;
          font-size: 30px;
        }

        .slick-prev {
          left: -${arrowOffset}px !important;
        }

        .slick-next {
          right: -${arrowOffset}px !important;
        }
      `}</style>
    </div>
  );
}
