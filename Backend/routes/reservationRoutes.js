const express = require('express'); 
const router = express.Router();

const {getClientReservations,
       updateAnnulation,createReservation
       ,getReservationsEnAttente ,confirmReservation ,
       marquerRetournee,getReservationsConfirmees,getReservationById,confirmerReservation,
        deleteReservation
      } = require('../Controllers/reservationcontroller'); 
const { authenticateClient } = require('../Middlewares/authMidleware');

// Route protégée par JWT pour récupérer les réservations du client connecté
router.get('/mes-reservations', authenticateClient, getClientReservations);

// Mettre à jour le statut d'annulation
router.put('/:id/status', authenticateClient, updateAnnulation);

// Créer une réservation
router.post('/', authenticateClient, createReservation);
//confirmation 

router.put('/:id/confirmer', confirmReservation);

// get reservation confirme par agence //cote agence 
router.get('/agence/:id/confirmees', getReservationsConfirmees);

//marquer voiture retourne 
router.put('/:id/retournee', marquerRetournee);

// ✅ Route pour récupérer les réservations en attente d'une agence spécifique
router.get('/agence/:id/en-attente', getReservationsEnAttente);  // ✅ Appelle la fonction importée

router.get('/:id/reservation',authenticateClient,getReservationById); // ✅ Route pour récupérer une réservation par ID

// ✅ Route pour confirmer une réservation par client
router.get('/client/:id/confirmer',authenticateClient ,confirmerReservation); // ✅ Appelle la fonction importée


//route pour la suppression en cas d'annuler ;
router.delete('/:id', deleteReservation);




module.exports = router;
