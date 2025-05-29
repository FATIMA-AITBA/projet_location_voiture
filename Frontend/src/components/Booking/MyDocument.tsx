import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "../../../public/images/logo.png";

const stylesPdf = StyleSheet.create({
  page: {
    padding: 15,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    color: '#2c3e50',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    color: '#34495e',
    borderBottom: '1 solid #ccc',
    paddingBottom: 3,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  value: {
    fontSize: 10,
    color: '#2c3e50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  row: {
    marginBottom: 4,
  },
  carImage: {
    width: 120,
    height: 80,
    borderRadius: 4,
    objectFit: 'cover',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  smallGray: {
    fontSize: 8,
    color: '#6c757d',
  },
  line: {
    borderBottom: '1 solid #ccc',
    marginVertical: 6,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
  titleCentered: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
});

interface MyDocumentProps {
  formData: {
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    street: string;
    postalCode: string;
    city: string;
  };
  reservationData: {
    id_reservation: number;
    id_voiture: number;
    image: string;
    name: string;
    marque: string;
    carType: string;
    fuelType: string;
    typeBoite: string;
    nombre_bagages: string;
    places: string;
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
  daysDifference: number | null;
  TypeAssurance: string;
  clientdata: {
    name: string;
    email: string;
    contact: string;
  }
}

const MyDocument: React.FC<MyDocumentProps> = ({
  formData,
  reservationData,
  daysDifference,
  TypeAssurance,
  clientdata,
}) => {
  return (
    <Document>
      <Page size="A4" style={stylesPdf.page}>
        <Image src={logo as string} style={stylesPdf.logo} />
        <Text style={stylesPdf.title}>Reçu de Réservation</Text>

        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Informations du Locataire</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Nom :</Text> {clientdata.name}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Email :</Text> {clientdata.email}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Téléphone :</Text> {clientdata.contact}</Text>
        </View>

        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Informations du Chauffeur</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Nom :</Text> {formData.firstName} {formData.lastName}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Email :</Text> {formData.email}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Téléphone :</Text> {formData.phoneNumber}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Adresse :</Text> {formData.street}, {formData.postalCode}, {formData.city}, {formData.country}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Entreprise :</Text> {formData.company}</Text>
        </View>

        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Détails du Véhicule</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}> Voiture :</Text> {reservationData.name} </Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Marque : </Text>{reservationData.marque}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Type de voiture :</Text> {reservationData.carType}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Type de carburant :</Text> {reservationData.fuelType}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Type de boîte :</Text> {reservationData.typeBoite}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Nombre de bagages :</Text> {reservationData.nombre_bagages}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Nombre de places :</Text> {reservationData.places}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Lieu de départ :</Text> {reservationData.lieu_retrait}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Date de départ :</Text> {reservationData.date_depart}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Lieu de retour :</Text> {reservationData.lieu_retour}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Date de retour :</Text> {reservationData.date_retour}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>nombre de jours de location :</Text> {daysDifference ?? 'N/A'} jours</Text>
            </View>
            {reservationData.image && (
              <Image src={`http://localhost:5000/uploads/${reservationData.image}`} style={stylesPdf.carImage} />
            )}
          </View>
        </View>

        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Facturation</Text>

          <View style={stylesPdf.infoRow}>
            <Text style={stylesPdf.label}>Type de kilométrage :</Text>
            <Text style={stylesPdf.value}>{reservationData.kilometrageType}</Text>
          </View>
          <View style={stylesPdf.infoRow}>
            <Text style={stylesPdf.label}>Type d'assurance :</Text>
            <Text style={stylesPdf.value}>{TypeAssurance}</Text>
          </View>

          <View style={stylesPdf.section}>
            <Text style={stylesPdf.titleCentered}>DÉTAILS DU PRIX</Text>

            <View>
              <Text style={stylesPdf.boldText}>Frais de location (Montant hors taxes) :</Text>
              <Text style={[stylesPdf.smallGray, { marginLeft: 10 }]}>
                {daysDifference} Jour de location x {reservationData.prix_journalier} MAD
              </Text>
            </View>

            <View style={stylesPdf.rowBetween}>
              <Text style={stylesPdf.boldText}></Text>
              <Text style={stylesPdf.boldText}>{reservationData.montantHT} MAD</Text>
            </View>

            <View style={stylesPdf.line} />

            <Text style={[stylesPdf.boldText, { marginBottom: 4 }]}>Taxes et frais :</Text>
            <View style={[stylesPdf.rowBetween, { marginLeft: 10 }]}>
              <Text>TVA :</Text>
              <Text>{reservationData.TVA} MAD</Text>
            </View>
            <View style={[stylesPdf.rowBetween, { marginLeft: 10 }]}>
              <Text>Supplément local :</Text>
              <Text>{reservationData.supp_local} MAD</Text>
            </View>

            <View style={stylesPdf.rowBetween}>
              <Text style={stylesPdf.boldText}></Text>
              <Text style={stylesPdf.boldText}>{reservationData.total_frais} MAD</Text>
            </View>

            <View style={stylesPdf.line} />

            <View style={stylesPdf.rowBetween}>
              <Text style={stylesPdf.totalText}>Total (TTC) :</Text>
              <Text style={stylesPdf.totalText}>{reservationData.montantTTC} MAD</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
