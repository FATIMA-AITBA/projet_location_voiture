const { getReservationsHistoryByClient,getReservationsHistoryByAgence } = require('../Models/reservationhistorymodel');

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


exports.getAgenceReservationsHistory = async (req, res) => {
  // on récupère l'ID agence dans l’URL ou dans le token
  const agenceId = parseInt(req.params.id, 10) || req.client.id;
  try {
    await new Promise(r => setTimeout(r, 1000));
    const reservationshistoriques = await getReservationsHistoryByAgence(agenceId);
    res.status(200).json({
      message: 'Historique agence chargé',
      data: reservationshistoriques
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};





