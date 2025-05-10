import { useEffect, useState } from 'react';
import Card from '../Utils/Card';
import CarDetails from '../Utils/CarDetails';

interface Car {
  [key: string]: any; // Remplace ça avec une interface plus précise si tu connais la structure de la voiture
}

interface GalerieSectionProps {
  carList: Car[];
  differenceEnJours: number;
  dateDepart: string;
  dateRetour: string;
}

export default function GalerieSection({ carList, differenceEnJours,dateDepart,dateRetour }: GalerieSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColsPerRow = () => {
    if (windowWidth >= 1280) return 3;
    if (windowWidth >= 768) return 2;
    return 1;
  };

  const colsPerRow = getColsPerRow();

  // Diviser carList en lignes
  const rows: Car[][] = [];
  for (let i = 0; i < carList.length; i += colsPerRow) {
    rows.push(carList.slice(i, i + colsPerRow));
  }

  return (
    <div className="max-w-[1200px] mx-auto p-3">
      <div className="flex flex-col gap-6">
        {rows.map((row: Car[], rowIndex: number) => {
          const rowStartIndex = rowIndex * colsPerRow;
          return (
            <div key={rowIndex} className="flex flex-col gap-2">
              {/* ligne de cartes */}
              <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3`}>
                {row.map((car, colIndex) => {
                  const globalIndex = rowStartIndex + colIndex;
                  return (
                    <div key={globalIndex} className="flex flex-col gap-2">
                      <Card
                        car={car}
                        onSelect={() =>
                          setSelectedIndex(
                            selectedIndex === globalIndex ? null : globalIndex
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>

              {/* bloc détails s'affiche sous toute la ligne */}
              {row.some((_, i) => selectedIndex === rowStartIndex + i) && selectedIndex !== null && (
                <div className="w-full animate-fade-in">
                  <CarDetails
                    car={carList[selectedIndex]}
                    onBack={() => setSelectedIndex(null)}
                    differenceEnJours={differenceEnJours}
                    dateDepart={dateDepart}
                    dateRetour={dateRetour}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
