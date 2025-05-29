
const { getAllVoitures } = require('../Models/voituremodel');
const { getAllReservationsWithVoiture } = require('../Models/reservationmodel');
const voitureModel = require('../Models/voituremodel'); 

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
      nombrePortes: v.nombre_portes,
      nombreBagages: v.nombre_bagages,
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
        url: `http://localhost:5000/uploads/${v.image}`,
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




exports.createCar = async (req, res) => {
  try {
    const id_agence = req.client?.id;
    if (!id_agence) return res.status(403).json({ message: "Authentification requise" });

    const imagePath = req.file ? req.file.filename : null;

    const carData = {
      ...req.body,
      image: imagePath, // stocker le chemin de l'image
      places: parseInt(req.body.places, 10),
      nombre_portes: parseInt(req.body.nombre_portes, 10),
      nombre_bagages: parseInt(req.body.nombre_bagages, 10),
      prix_par_jour: parseFloat(req.body.prix_par_jour),
      kilometrage_inclus: parseInt(req.body.kilometrage_inclus, 10),
      tarif_km_sup: req.body.tarif_km_sup ? parseFloat(req.body.tarif_km_sup) : null,
      tarif_km_illimites_par_jour: req.body.tarif_km_illimites_par_jour ? parseFloat(req.body.tarif_km_illimites_par_jour) : null,
      disponible: 1,
      id_agence
    };

    const carId = await voitureModel.createCar(carData);
    res.status(201).json({ success: true, carId, message: "Voiture publiée avec succès" });
  } catch (error) {
    console.error("Erreur création:", error);
    res.status(500).json({ success: false, message: "Erreur interne du serveur" });
  }
};
