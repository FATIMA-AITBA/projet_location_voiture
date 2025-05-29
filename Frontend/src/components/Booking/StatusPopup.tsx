// StatusPopup.tsx
import React from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineDownload } from 'react-icons/ai';
import { pdf } from '@react-pdf/renderer';
import MyDocument from './MyDocument';

interface StatusPopupProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  // données à passer au PDF si besoin
  formData: any;
  reservationData: any;
  daysDifference: number | null;
  TypeAssurance: string;
  clientdata : any;

}

const StatusPopup: React.FC<StatusPopupProps> = ({
  type,
  message,
  onClose,
  formData,
  reservationData,
  daysDifference,
  TypeAssurance,
  clientdata,
}) => {
  const isSuccess = type === 'success';

  const handleDownload = async () => {
    const blob = await pdf(<MyDocument 
          formData={formData} 
          reservationData={reservationData} 
         daysDifference={daysDifference} 
          TypeAssurance={TypeAssurance}
          clientdata={clientdata}
      />).toBlob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recu_reservation.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[80%] max-w-md h-auto min-h-[100px] p-3 text-center relative flex flex-col items-center justify-center">
        <div
          className={`flex items-center justify-center w-20 h-20 rounded-full ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isSuccess ? (
            <AiOutlineCheckCircle className="text-green-600 text-8xl" />
          ) : (
            <AiOutlineCloseCircle className="text-red-600 text-6xl" />
          )}
        </div>

        <h2 className={`text-3xl font-bold mt-6 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {isSuccess ? 'Réservation Confirmée' : 'Échec de la Réservation'}
        </h2>

        <p className="text-gray-700 mt-4 text-lg">{message}</p>

        <div className="mt-8 flex justify-center gap-6 items-center flex-col">
          {isSuccess ? (
            <>
              <p className="text-gray-700 mt-4 text-lg">
                Veuillez télécharger votre reçu de réservation en cliquant sur l’icône ci-dessous.
              </p>
              <button
                onClick={handleDownload}
                title="Télécharger le PDF"
                className="text-green-600 hover:text-green-800 text-4xl"
                aria-label="Télécharger PDF"
              >
                <AiOutlineDownload size={60} />
              </button>
            </>
          ) : (
            <>
              <button
                className="px-6 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 text-base font-medium"
                onClick={onClose}
              >
                Continuer
              </button>
              <button
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-base font-medium"
                onClick={onClose}
              >
                Réessayer
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default StatusPopup;
