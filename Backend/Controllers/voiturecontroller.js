
/*const { getAllVoitures } = require('../Models/voituremodel');
const { getAllReservations } = require('../Models/reservationmodel');

exports.getAllVoituresEtReservations = async (req, res) => {
  try {
    const voitures = await getAllVoitures();
    const reservations = await getAllReservations();

    res.status(200).json({
      message: 'Récupération réussie',
      voitures,
      reservations,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des voitures et réservations' });
  }
};
*/



const { getAllVoitures } = require('../Models/voituremodel');
const { getAllReservationsWithVoiture } = require('../Models/reservationmodel');

exports.getAllVoituresEtReservations = async (req, res) => {
  try {
    const voitures = await getAllVoitures();
    const reservationsRaw = await getAllReservationsWithVoiture();

    // CarLists format
    const carLists = voitures.map((v) => ({
      id: v.id,
      name: v.name,
      marque: v.marque,
      places: v.places,
      typeBoite: v.typeBoite,
      fuelType: v.fuelType,
      carType: v.carType,
      prixParJour: v.prix_par_jour,
      kilometrageInclus: v.kilometrage_inclus,
      tarifKmSupp: v.tarif_km_sup,
      tarifKmIlimitesParJour: v.tarif_km_illimites_par_jour,
      lieuDeRetrait: v.lieu_retrait,
      lieuDeRetour: v.lieu_retour,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      image: {
        url: `/uploads/${v.image}`,
      },
    }));

    // Reservations format
    const reservations = reservationsRaw.map((r) => ({
      id: r.id_reservation,
      dateDeDepart: r.date_depart,
      dateDeRetour: r.date_retour,
      carList: {
        id: r.id_voiture,
        name: r.nom_voiture,
        marque: r.marque_voiture,
      },
    }));

    return res.status(200).json({
      carLists,
      reservations,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
