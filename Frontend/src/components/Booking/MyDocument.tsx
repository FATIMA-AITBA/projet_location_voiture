import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "../../../public/images/logo.png";

const stylesPdf = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#34495e',
    borderBottom: '1 solid #ccc',
    paddingBottom: 5,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    border: '1 solid #ddd',
    borderRadius: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  row: {
    marginBottom: 6,
  },
  carImage: {
    width: 150,
    height: 100,
    borderRadius: 4,
    objectFit: 'cover',
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
    lieu_retrait: string;
    date_depart: string;
    lieu_retour: string;
    date_retour: string;
  };
  daysDifference: number | null;
  montantHT: string;
  montantTTC: string;
  Typekilometrage: string;
  TypeAssurance: string;
}

const MyDocument: React.FC<MyDocumentProps> = ({
  formData,
  reservationData,
  daysDifference,
  montantHT,
  montantTTC,
  Typekilometrage,
  TypeAssurance,
}) => {
  return (
    <Document>
      <Page size="A4" style={stylesPdf.page}>
        {/* Logo centré */}
        <Image src={logo as string} style={stylesPdf.logo} />

        {/* Titre */}
        <Text style={stylesPdf.title}>Reçu de Réservation</Text>

        {/* Infos chauffeur */}
        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Informations du Chauffeur</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Nom :</Text> {formData.firstName} {formData.lastName}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Email :</Text> {formData.email}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Téléphone :</Text> {formData.phoneNumber}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Adresse :</Text> {formData.street}, {formData.postalCode}, {formData.city}, {formData.country}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Entreprise :</Text> {formData.company}</Text>
        </View>

        {/* Infos véhicule avec image à droite */}
        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Détails du Véhicule</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 2 }}>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Voiture :</Text> {reservationData.name} ({reservationData.marque} - {reservationData.carType})</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Lieu de départ :</Text> {reservationData.lieu_retrait}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Date de départ :</Text> {reservationData.date_depart}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Lieu de retour :</Text> {reservationData.lieu_retour}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Date de retour :</Text> {reservationData.date_retour}</Text>
              <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Durée :</Text> {daysDifference ?? 'N/A'} jours</Text>
            </View>

            {reservationData.image && (
              <Image src={reservationData.image} style={stylesPdf.carImage} />
            )}
          </View>
        </View>

        {/* Facturation */}
        <View style={stylesPdf.section}>
          <Text style={stylesPdf.sectionTitle}>Facturation</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Montant HT :</Text> {montantHT} MAD</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Montant TTC :</Text> {montantTTC} MAD</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Kilométrage :</Text> {Typekilometrage}</Text>
          <Text style={stylesPdf.row}><Text style={stylesPdf.label}>Assurance :</Text> {TypeAssurance}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
