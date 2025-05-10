const db = require('../config/db');

// Récupérer les réservations d'un client a paratir de la base de données
const getReservationsByClient = (clientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
         SELECT 
            r.id_reservation,
            DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date_reservation,
            v.name AS nom_voiture,
            a.nom AS nom_agence,
            r.confirmee,
            DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
            v.lieu_retrait,
            DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
            v.lieu_retour,
            r.annulee
        FROM 
            reservation r
        JOIN 
            voiture v ON r.id_voiture = v.id
        JOIN 
            agence a ON v.id_agence = a.id
        WHERE 
            r.id_client = ?;

    `;

    db.query(sql, [clientId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


// Mettre à jour le statut d'annulation d'une réservation dans la base de données
const updateAnnulation = (reservationId, newStatus) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE reservation
      SET annulee = ?
      WHERE id_reservation = ?;
    `;

    db.query(sql, [newStatus, reservationId], (err, results) => {
      if (err) return reject(err);
      if (results.affectedRows === 0) {
        return reject(new Error('Réservation non trouvée'));
      }
      resolve(results);
    });
  });
};


const getAllReservationsWithVoiture = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        r.id_reservation,
        DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
        DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
        v.id AS id_voiture,
        v.name AS nom_voiture,
        v.marque AS marque_voiture
      FROM reservation r
      JOIN voiture v ON r.id_voiture = v.id
    `;

    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



module.exports = {
  getReservationsByClient,
  updateAnnulation,
  getAllReservationsWithVoiture
};


