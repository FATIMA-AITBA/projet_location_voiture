const db = require('../config/db');

// Récupérer l'historique des réservations d'un client à partir de la base de données
const getReservationsHistoryByClient = (clientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT 
        r.id_historique,
        DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS date_reservation,
        v.name AS nom_voiture,
        a.nom AS nom_agence,
        DATE_FORMAT(r.date_depart, '%Y-%m-%d') AS date_depart,
        v.lieu_retrait,
        DATE_FORMAT(r.date_retour, '%Y-%m-%d') AS date_retour,
        v.lieu_retour
    FROM 
        historique_reservation r
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


const getReservationsHistoryByAgence = (agenceId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        v.name            AS vehicule,
        c.nom             AS client,
        DATE_FORMAT(r.date_reservation, '%Y-%m-%d') AS dateReservation,
        DATE_FORMAT(r.date_depart,      '%Y-%m-%d') AS dateDepart,
        DATE_FORMAT(r.date_retour,      '%Y-%m-%d') AS dateRetour
      FROM historique_reservation r
      JOIN voiture v   ON r.id_voiture = v.id
      JOIN client c    ON r.id_client  = c.id
      WHERE v.id_agence = ?
      ORDER BY r.date_archivage DESC
    `;
    db.query(sql, [agenceId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};




module.exports = {
    getReservationsHistoryByClient,
    getReservationsHistoryByAgence
  };
  