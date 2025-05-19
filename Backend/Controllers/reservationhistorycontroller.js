const { getReservationsHistoryByClient } = require('../Models/reservationhistorymodel');

// Récupérer les réservations historiques d'un client
exports.getClientReservationsHistory = async (req, res) => {

  // ID client récupéré via le middleware d'authentification
  const clientId = req.client.id;

  try {
     // Simuler un délai (1s) pour l'effet de loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Récupérer les réservations historiques du client
    const reservationshistoriques = await  getReservationsHistoryByClient(clientId);
   
     // Répondre avec le message + données recupérées
    res.status(200).json({
      message: 'Liste des réservations historique récupérée avec succès',
      reservationshistoriques
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations historique :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



