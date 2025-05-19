const { get } = require('http');
const { getReservationsByClient,
       updateAnnulation,addReservation,
       getReservationsEnAttenteByAgence,
       confirmReservation,
       getReservationsConfirmeesByAgence,
       marquerRetournee,
       confirmerReservation,
       deleteReservation,
       getReservationById,
       
      } = require('../Models/reservationmodel');

// Récupérer les réservations d'un client
exports.getClientReservations = async (req, res) => {
  //ID client récupéré via le middleware
  const clientId = req.client.id; 
  
  try {

    // Simuler un délai (1s) pour l'effet de loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Récupérer les réservations du client
    const reservations = await getReservationsByClient(clientId);
   
    // Répondre avec le message + données récupérées
    res.status(200).json({
      message: 'Liste des réservations récupérée avec succès',
      reservations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



// Mettre à jour le statut d'annulation d'une réservation
exports.updateAnnulation = async (req, res) => {
  //ID client récupéré via le middleware
  const clientId = req.client.id; 
  //ID réservation récupéré via les paramètres de la requête
  const reservationId = req.params.id;
  //Statut d'annulation récupéré via le corps de la requête
  const { annulee } = req.body; 

  try {
    // Simuler un délai (1s) pour l'effet de loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mettre à jour le statut d'annulation
    await updateAnnulation(reservationId, annulee);

    // Récupérer les réservations mises à jour du client
    const updatedReservations = await getReservationsByClient(clientId);

    // Vérifier si la réservation a été annulée ou confirmée
    const message = annulee
      ? "Réservation annulée avec succès"
      : "Réservation confirmée avec succès";

    // Répondre avec le message + données mises à jour
    res.status(200).json({ message, reservations: updatedReservations });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de l'annulation",
      error: error.message || error
    });
  }
};

// Ajouter une nouvelle réservation
exports.createReservation = async (req, res) => {
  const clientId = req.client.id;
  const { date_depart, date_retour, id_voiture ,prix_journalier, montantHT,TVA,supp_local,total_frais, montantTTC,  kilometrageType } = req.body;

  // Vérification des données reçues
  if (!date_depart || !date_retour || !id_voiture || !prix_journalier || !montantHT || !TVA || !supp_local || !total_frais || !montantTTC || !kilometrageType) {
    return res.status(400).json({ message: 'Données manquantes dans la requête' });
  }

  // Vérification des dates
  if (new Date(date_depart) > new Date(date_retour)) {
    return res.status(400).json({ message: 'La date de départ ne peut pas être après la date de retour' });
  }

  try {
    // Ajouter la réservation
    await addReservation({
      date_depart,
      date_retour,
      id_voiture,
      id_client: clientId,
      prix_journalier,
      montantHT,
      TVA,
      supp_local,
      total_frais,
      montantTTC,
      kilometrageType
    });

    res.status(201).json({ message: 'Réservation créée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error });
  }
};

//pour la recuperation reservationSection de agence 
exports.getReservationsEnAttente = (req, res) => {
  const id_agence = req.params.id;
  console.log("[DEBUG] ID Agence reçu:", id_agence); // ✅ Vérifiez la valeur
  console.log(`Tentative de récupération des réservations pour l'agence ${id_agence}`); // ✅

  getReservationsEnAttenteByAgence(id_agence, (err, reservations) => {
    if (err) {
      console.error("Erreur MySQL:", err); // ✅
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    console.log("Résultats trouvés:", reservations); // ✅
    res.json(reservations);
  });
};


//confirme 


exports.confirmReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    await confirmReservation(reservationId);
    res.status(200).json({ message: 'Réservation confirmée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la confirmation :", error);
    res.status(500).json({ message: "Erreur serveur lors de la confirmation", error });
  }
};


//les reservation confirme 

exports.getReservationsConfirmees = (req, res) => {
  const id_agence = req.params.id;
  
  getReservationsConfirmeesByAgence(id_agence, (err, reservations) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json(reservations);
  });
};

//bouton retourne 

exports.marquerRetournee = async (req, res) => {
  try {
    const result = await marquerRetournee(req.params.id);
    
    let message;
    if (result.archived) {
      message = "Réservation archivée dans l'historique et voiture marquée comme disponible";
    } else if (result.deleted) {
      message = "Réservation annulée supprimée et voiture marquée comme disponible";
    } else {
      message = "Voiture marquée comme disponible";
    }

    res.status(200).json({ message });

  } catch (error) {
    console.error('[ERREUR]', error);
    res.status(500).json({ 
      message: error.message || "Erreur serveur",
      error: error.message 
    });
  }
};


exports.getReservationById = async (req, res) => {
  // ID de la réservation récupéré depuis le header
   const reservationId = req.params.id; // récupération depuis le header

  if (!reservationId) {
    return res.status(400).json({ message: "L'ID de la réservation est requis dans le header 'reservation-id'" });
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reservations = await getReservationById(reservationId);

    res.status(200).json({
      message: 'Réservation récupérée avec succès',
      reservations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation :', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message || error });
  }
};




exports.confirmerReservation = async (req, res) => {
  const reservationId = req.params.id; // ou `req.body.id` selon ton routing

  if (!reservationId) {
    return res.status(400).json({ message: 'ID de réservation manquant' });
  }

  try {
    await confirmerReservation(reservationId);
    res.status(200).json({ message: 'Réservation confirmée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la confirmation :', error.message);
    res.status(500).json({ message: 'Erreur lors de la confirmation de la réservation', error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  const reservationId = req.params.id;
  try {
    // Récupérer la résa pour savoir quelle voiture libérer
    const reservation = await getReservationById(reservationId);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });

    // 1. Marquer la voiture disponible
    await marquerRetournee(reservationId);

    // 2. Supprimer la réservation
    await deleteReservation(reservationId);

    res.status(200).json({ message: 'Réservation annulée et voiture libérée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
